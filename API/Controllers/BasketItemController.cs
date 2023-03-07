using API.Dtos;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace API.Controllers
{
    public class BasketItemController : ControllerBase
    {
        private readonly IConfiguration _config;

        public BasketItemController(IConfiguration config)
        {
            _config = config;
        }

        [Route("api/BasketItem")]
        [HttpGet]
        public async Task<ActionResult<List<BasketItemConfirm>>> GetBasketItem(Guid basketId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.OpenAsync();
            var transaction = connection.BeginTransaction();
            try
            {
                var basket = await connection.QueryAsync<BasketItemConfirm>(
                    $@"
        select BI.*, P.Name, P.Price, p.Description
        from BasketItem as BI
        inner join Product as P on BI.ProductId = P.Id
        inner join Basket as B on B.Id = BI.BasketId
        where B.Id = @BasketId
    ",
                    new { BasketId = basketId },
                    transaction
                );

                if (basket == null || !basket.Any())
                {
                    return NotFound();
                }

                transaction.Commit();
                var products = basket.Select(b => new BasketItemConfirm
                {
                    Quantity = b.Quantity,
                    ProductId = b.ProductId,
                    Id = b.Id,
                    Name = b.Name,
                    Description = b.Description,
                    Price = b.Price
                }).ToList();

                return products;

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return BadRequest(new ProblemDetails { Title = "Problem adding item to basket item", Detail = ex.Message });
            }
        }
    }
}
