using API.Models;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BasketController : ControllerBase
    {
        private readonly IConfiguration _config;

        public BasketController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<ActionResult<Bascket>> GetBascket()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var bascket = await connection.QueryFirstOrDefaultAsync<Bascket>(
                   "SELECT * FROM Bascket " +
                   "LEFT JOIN BascketItem ON Bascket.Id = BascketItem.BascketId " +
                   "LEFT JOIN Product ON BascketItem.ProductId = Product.Id " +
                   "WHERE Bascket.BuyerId = @buyerId",
                   new { buyerId = Request.Cookies["buyerId"] });

            if (bascket == null)
            {
                return NotFound();
            }

            return Ok(bascket);
        }

        [HttpPost]
        public async Task<ActionResult<Product>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket();
            if (basket == null) basket = await CreateBasket();

            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();
            using var transaction = connection.BeginTransaction();
            try
            {
                await connection.ExecuteAsync(
                    "INSERT INTO BasketItem (ProductId, Quantity, BasketId) VALUES (@ProductId, @Quantity, @BasketId)",
                    new { ProductId = productId, Quantity = quantity, BasketId = basket.Id },
                    transaction: transaction);

                transaction.Commit();

                return StatusCode(201);
            }
            catch (Exception)
            {
                transaction.Rollback();
                return BadRequest(new ProblemDetails { Title = "Problem adding item to the basket" });
            }
        }


        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity = 1)
        {
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound();

            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            basket.RemoveItem(productId, quantity);

            var rowsAffected = await connection.ExecuteAsync(
                "UPDATE BasketItems SET Quantity = @Quantity WHERE BasketId = @BasketId AND ProductId = @ProductId",
                new { Quantity = basket.Items.Single(x => x.ProductId == productId).Quantity, BasketId = basket.Id, ProductId = productId });

            if (rowsAffected > 0)
            {
                await connection.ExecuteAsync(
                    "DELETE FROM BasketItems WHERE Quantity = 0 AND BasketId = @BasketId AND ProductId = @ProductId",
                    new { BasketId = basket.Id, ProductId = productId });

                return Ok();
            }

            return BadRequest(new ProblemDetails { Title = "Problem removing item from the basket" });
        }




        private async Task<Bascket> RetrieveBasket()
        {
            var buyerId = Request.Cookies["buyerId"];
            if (buyerId == null) return null;

            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var basket = await connection.QueryFirstOrDefaultAsync<Bascket>(
                "SELECT * FROM Basket WHERE BuyerId = @BuyerId",
                new { BuyerId = buyerId });

            if (basket != null)
            {
                var basketItems = await connection.QueryAsync<BascketItem>(
                    "SELECT * FROM BasketItem WHERE BasketId = @BasketId",
                    new { BasketId = basket.Id });
                basket.Items = basketItems.ToList();
            }

            return basket;
        }

        private async Task<Bascket> CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);

            var basket = new Bascket { BuyerId = buyerId };

            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.ExecuteAsync(
                "INSERT INTO Basket (BuyerId) VALUES (@BuyerId)",
                new { BuyerId = basket.BuyerId });

            basket.Id = await connection.QuerySingleAsync<int>("SELECT @@IDENTITY");

            return basket;
        }
    }
}
