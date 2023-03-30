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
            [FromQuery] string? search
            )
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.OpenAsync();

            using var transaction = await connection.BeginTransactionAsync();

            try
            {
                var query = new StringBuilder("SELECT * FROM Product");

                //検索ワードがある場合
                if (!string.IsNullOrEmpty(search))
                {
                    query.Append(" WHERE Name LIKE @SearchTerm");
                }

                //ソートの条件
                query.Append(sort switch
                {
                    "high-price" => " ORDER BY price DESC",
                    "low-price" => " ORDER BY price ASC",
                    _ => ""
                });
                var brandList = new List<string>();
                var typeList = new List<string>();

                //パラメーターの使用
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


        //ソートと検索、フィルタリングの両方成功
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
        //    [FromQuery] string? sort,
        //    [FromQuery] string? search,
        //    [FromQuery] string? brands,
        //    [FromQuery] string? types
        //)
        //{
        //    using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
        //    await connection.OpenAsync();

        //    using var transaction = await connection.BeginTransactionAsync();

        //    try
        //    {
        //        var query = new StringBuilder("SELECT * FROM Product");

        //        var hasSearchTerm = !string.IsNullOrEmpty(search);
        //        var hasBrand = !string.IsNullOrEmpty(brands);
        //        var hasType = !string.IsNullOrEmpty(types);
        //        var parameters = new DynamicParameters();

        //        if (hasSearchTerm || hasBrand || hasType)
        //        {
        //            query.Append(" WHERE");

        //            if (hasSearchTerm)
        //            {
        //                query.Append(" Name LIKE @SearchTerm");
        //                parameters.Add("@SearchTerm", $"%{search}%");
        //            }

        //            if (hasBrand)
        //            {
        //                query.Append(hasSearchTerm ? " AND" : "");
        //                query.Append(" Brand = @Brand");
        //                parameters.Add("@Brand", brands);
        //            }

        //            if (hasType)
        //            {
        //                query.Append((hasSearchTerm || hasBrand) ? " AND" : "");
        //                query.Append(" Type = @Type");
        //                parameters.Add("@Type", types);
        //            }
        //        }


        //        var products = await connection.QueryAsync<Product>(query.ToString(), parameters, transaction);

        //        await transaction.CommitAsync();

        //        return Ok(products);
        //    }
        //    catch (Exception ex)
        //    {
        //        await transaction.RollbackAsync();
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
