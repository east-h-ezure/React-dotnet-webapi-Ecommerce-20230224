using API.Models;
using API.Services;
using Dapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace API.Controllers
{
    public class AccountController: BaseApiController
    {
        private readonly IConfiguration _config;
        private readonly TokenService _tokenService;
        private readonly UserManager<User> _userManager;
        public AccountController(IConfiguration config, TokenService tokenService, UserManager<User> userManager)
        {
            _config = config;
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(Login login)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.OpenAsync();

            using var transaction = await connection.BeginTransactionAsync();
            try
            {
                var user = await _userManager.FindByNameAsync(login.UserName);
                if (user == null || !await _userManager.CheckPasswordAsync(user, login.Password))
                    return Unauthorized();

                var userBasket = await RetrieveBasket(login.UserName);
                var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);
                if (anonBasket != null)
                {
                    if (userBasket != null)
                    {
                        await connection.ExecuteAsync("DELETE FROM Baskets WHERE Id = @Id", new { Id = userBasket.Id });
                    }

                    await connection.ExecuteAsync("UPDATE Baskets SET BuyerId = @BuyerId WHERE Id = @Id", new { BuyerId = user.UserName, Id = anonBasket.Id });

                    Response.Cookies.Delete("buyerId");
                }
                await transaction.CommitAsync();
                return new User
                {
                    Email = user.Email,
                    Token = await _tokenService.GenerateToken(user),
                    Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new ProblemDetails
                {
                    Title = "Problem removing item to basket",
                    Detail = $"Error occurred while executing command: {ex.Message}"
                });
            };
           


        }

        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(Register register)
        {
            var user = new User { UserName = register.UserName, Email = register.Email };

            var result = await _userManager.CreateAsync(user, register.Password);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");

            return StatusCode(201);
        }


        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }

            using var connection = new SqlConnection("connectionString");
            await connection.OpenAsync();

            var sql = @"
        SELECT b.*, i.*, p.*
        FROM Baskets b
        LEFT JOIN BasketItems i ON b.Id = i.BasketId
        LEFT JOIN Products p ON i.ProductId = p.Id
        WHERE b.BuyerId = @BuyerId";

            var result = await connection.QueryAsync<Basket, BasketItem, Product, Basket>(
                sql,
                (basket, item, product) =>
                {
                    if (item != null)
                    {
                        item.Product = product;
                        basket.Items.Add(item);
                    }
                    return basket;
                },
                new { BuyerId = buyerId },
                splitOn: "Id,Id");

            return result.FirstOrDefault();
        }

    }
}
