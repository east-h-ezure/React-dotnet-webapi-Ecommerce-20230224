using API.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController: ControllerBase
    {
        private readonly IConfiguration _config;

        public ProductsController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<ActionResult<Product>> GetProducts()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var products = await connection.QueryAsync<Product>("SELECT * FROM Product");
            return Ok(products);
        }
        [HttpGet("{productId}")]
        public async Task<ActionResult<Product>> GetProduct(int productId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var product = await connection.QueryFirstAsync<Product>(
                "SELECT * FROM Product WHERE id = @Id",
                new { Id = productId}
                );
            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var data = await connection.ExecuteAsync($@"INSERT INTO Product (
Name,
 Description,
 Price,
 PictureUrl,
 Brand,
 Type,
 QuantityInStock
 )
 VALUES
  (
 @Name,
 @Description,
 @Price,
 @PictureUrl,
 @Brand,
 @Type,
 @QuantityInStock
 )", product);
            return Ok(data);
        }
        [HttpPut]
        public async Task<ActionResult<List<Product>>> UpdateProduct(Product product)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var data = await connection.ExecuteAsync($@"
UPDATE Product
SET
Name = @Name,
FirstName = @FirstName,
LastName = @LastName,
Place = @Place,
WHERE
Id = @Id",
product
);
            return Ok(data);
        }

        [HttpDelete("{productId}")]
        public async Task<ActionResult<List<Product>>> DeleteProduct(int productId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var data = await connection.ExecuteAsync($@"
DELETE Product
WHERE
Id = @Id
",
new { Id = productId}
);
            return Ok(data);
        }

    }
}
