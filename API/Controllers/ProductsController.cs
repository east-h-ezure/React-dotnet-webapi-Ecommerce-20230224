using API.Extentions;
using API.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Text;

namespace API.Controllers
{
    //[Route("api/[controller]")]
    //[ApiController]
    public class ProductsController: BaseApiController
    {
        private readonly IConfiguration _config;

        public ProductsController(IConfiguration config)
        {
            _config = config;
        }

        //string orderBy
        //[HttpGet]
        //public async Task<ActionResult<Product>> GetProducts()
        //{
        //    using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
        //    var query = await connection.QueryAsync<Product>("SELECT * FROM Product");
        //    return Ok(query);
        //}
        //価格のソート成功
        //[HttpGet]
        //public async Task<ActionResult<Product>> GetProducts([FromQuery] string? sort)
        //{
        //    using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        //    // sortクエリパラメーターの値によって、SQLのORDER BY句を変更する
        //    var query = sort switch
        //    {
        //        "high-price" => await connection.QueryAsync<Product>("SELECT * FROM Product ORDER BY price DESC"),
        //        "low-price" => await connection.QueryAsync<Product>("SELECT * FROM Product ORDER BY price ASC"),
        //        _ => await connection.QueryAsync<Product>("SELECT * FROM Product")
        //    };

        //    return Ok(query);
        //}


        //ソートと検索の両方成功
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
            [FromQuery] string? sort,
            [FromQuery] string? search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.OpenAsync();

            using var transaction = await connection.BeginTransactionAsync();

            try
            {
                var query = new StringBuilder("SELECT * FROM Product");

                if (!string.IsNullOrEmpty(search))
                {
                    query.Append(" WHERE Name LIKE @SearchTerm");
                }

                query.Append(sort switch
                {
                    "high-price" => " ORDER BY price DESC",
                    "low-price" => " ORDER BY price ASC",
                    _ => ""
                });

                var parameters = new DynamicParameters();
                if (!string.IsNullOrEmpty(search))
                {
                    parameters.Add("@SearchTerm", $"%{search}%");
                }

                var products = await connection.QueryAsync<Product>(query.ToString(), parameters, transaction);

                await transaction.CommitAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new ProblemDetails
                {
                    Title = "Problem removing item to basket",
                    Detail = $"Error occurred while executing command: {ex.Message}"
                });
            }
        }



        //[HttpGet]
        //public async Task<ActionResult<Product>> GetProducts([FromQuery(Name = "sort")] string sort = "low-price", [FromQuery(Name = "search")] string search = "")
        //{
        //    using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
        //    await connection.OpenAsync();

        //    using var transaction = connection.BeginTransaction();

        //    try
        //    {
        //        if (!string.IsNullOrWhiteSpace(search) && !string.IsNullOrWhiteSpace(sort))
        //        {
        //            var query = "SELECT * FROM Product WHERE name LIKE @keyword OR description LIKE @keyword";
        //            var products = await connection.Search(search, orderBy: sort, transaction: transaction);
        //            return Ok(products);
        //        }
        //        //sortが空の場合
        //        else if (!string.IsNullOrWhiteSpace(search) && string.IsNullOrWhiteSpace(sort))
        //        {
        //            var products = await connection.Search(search, transaction: transaction);
        //            return Ok(products);
        //        }
        //        //searchが空の場合
        //        else if (string.IsNullOrWhiteSpace(search) && !string.IsNullOrWhiteSpace(sort))
        //        {
        //            var products = await connection.Sort(sort, transaction);
        //            return Ok(products);
        //        }
        //        //両方空の場合
        //        else
        //        {
        //            var query = "SELECT * FROM Product";
        //            var result = await connection.QueryAsync<Product>(query, transaction: transaction);
        //            return Ok(result);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        transaction.Rollback();
        //        return BadRequest(new ProblemDetails
        //        {
        //            Title = "Problem removing item to basket",
        //            Detail = $"Error occurred while executing command: {ex.Message}"
        //        });
        //    }
        //}

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
 Type
 )
 VALUES
  (
 @Name,
 @Description,
 @Price,
 @PictureUrl,
 @Brand,
 @Type
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
