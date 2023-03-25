using API.Models;
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
                var basket = await connection.QueryAsync<BasketItemConfirm, Product, BasketItemConfirm>(
                    $@"
                        SELECT BI.*, P.*
                        FROM BasketItem AS BI
                        INNER JOIN Product AS P ON BI.ProductId = P.Id
                        INNER JOIN Basket AS B ON B.Id = BI.BasketId and B.Id =@BasketId
                    ",
                    (basketItem, product) =>
                    {
                        basketItem.Product = product;
                        return basketItem;
                    },
                    new { BasketId = basketId },
                    transaction,
                    splitOn: "Id"
                );

                if (basket == null || !basket.Any())
                {
                    return NotFound();
                }

                transaction.Commit();

                return basket.ToList();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return BadRequest(new ProblemDetails { Title = "Problem adding item to basket item", Detail = ex.Message });
            }
        }
    }
}
