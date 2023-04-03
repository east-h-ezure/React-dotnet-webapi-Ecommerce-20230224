using API.Extentions;
using API.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Linq.Dynamic.Core;
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
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
        //    [FromQuery] string? sort,
        //    [FromQuery] string? search
        //    )
        //{
        //    using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
        //    await connection.OpenAsync();

        //    using var transaction = await connection.BeginTransactionAsync();

        //    try
        //    {
        //        var query = new StringBuilder("SELECT * FROM Product");

        //        //検索ワードがある場合
        //        if (!string.IsNullOrEmpty(search))
        //        {
        //            query.Append(" WHERE Name LIKE @SearchTerm");
        //        }

        //        //ソートの条件
        //        query.Append(sort switch
        //        {
        //            "high-price" => " ORDER BY price DESC",
        //            "low-price" => " ORDER BY price ASC",
        //            _ => ""
        //        });
        //        var brandList = new List<string>();
        //        var typeList = new List<string>();

        //        //パラメーターの使用
        //        var parameters = new DynamicParameters();
        //        if (!string.IsNullOrEmpty(search))
        //        {
        //            parameters.Add("@SearchTerm", $"%{search}%");
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
        //    [HttpGet("{page}")]
        //    public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
        //[FromQuery] string sort,
        //[FromQuery] string search,
        //[FromQuery] string page = "1",
        //[FromQuery] string pageSize = "10"
        //)
        //    {
        //        int pageNum = int.TryParse(page, out int p) ? p : 1;
        //        int size = int.TryParse(pageSize, out int ps) ? ps : 10;

        //        // 以下のコードは先程紹介したページネーションの例と同じです。
        //        using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
        //        await connection.OpenAsync();

        //        using var transaction = await connection.BeginTransactionAsync();

        //        try
        //        {
        //            var query = new StringBuilder("SELECT * FROM Product");

        //            if (!string.IsNullOrEmpty(search))
        //            {
        //                query.Append(" WHERE Name LIKE @SearchTerm");
        //            }

        //            query.Append(sort switch
        //            {
        //                "high-price" => " ORDER BY price DESC",
        //                "low-price" => " ORDER BY price ASC",
        //                _ => ""
        //            });

        //            var offset = (pageNum - 1) * size;
        //            query = query.Append($" OFFSET {offset} ROWS FETCH NEXT {size} ROWS ONLY");

        //            var parameters = new DynamicParameters();
        //            if (!string.IsNullOrEmpty(search))
        //            {
        //                parameters.Add("@SearchTerm", $"%{search}%");
        //            }

        //            var products = await connection.QueryAsync<Product>(query.ToString(), parameters, transaction);

        //            await transaction.CommitAsync();

        //            return Ok(products);
        //        }
        //        catch (Exception ex)
        //        {
        //            await transaction.RollbackAsync();
        //            return BadRequest(new ProblemDetails
        //            {
        //                Title = "Problem removing item to basket",
        //                Detail = $"Error occurred while executing command: {ex.Message}"
        //            });
        //        }
        //    }
        //[HttpGet]
        //public async Task<IActionResult> GetPagedProducts(int page, int pageSize)
        //{
        //    int skip = (page - 1) * pageSize;
        //    int take = pageSize;
        //    using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
        //    await connection.OpenAsync();
        //    using var transaction = await connection.BeginTransactionAsync();

        //    try
        //    {
        //                string sql = "SELECT * FROM Product ORDER BY Id OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY";
        //                var parameters = new { Skip = skip, Take = take };
        //                var command = new SqlCommand(sql, connection, (SqlTransaction)transaction);
        //                var products = await connection.QueryAsync<Product>(sql, parameters, transaction);

        //                await transaction.CommitAsync();

        //                return Ok(products);

        //            }
        //            catch (Exception ex)
        //            {
        //                await transaction.RollbackAsync();
        //                return BadRequest(new ProblemDetails
        //                {
        //                    Title = "Problem getting paged products",
        //                    Detail = $"Error occurred while executing command: {ex.Message}"
        //                });
        //            }
        //        }






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
        //4つの機能を追加してテスト中
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
    [FromQuery] string? sort,
    [FromQuery] string? search,
    [FromQuery] string? brands,
    [FromQuery] string? types,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10
)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.OpenAsync();

            using var transaction = await connection.BeginTransactionAsync();

            try
            {
                var query = new StringBuilder("SELECT * FROM Product");

                var hasSearchTerm = !string.IsNullOrEmpty(search);
                var hasBrand = !string.IsNullOrEmpty(brands);
                var hasType = !string.IsNullOrEmpty(types);
                var parameters = new DynamicParameters();

                if (hasSearchTerm || hasBrand || hasType)
                {
                    query.Append(" WHERE");

                    if (hasSearchTerm)
                    {
                        query.Append(" Name LIKE @SearchTerm");
                    parameters.Add("@SearchTerm", $"%{search}%");
                    }

                    if (hasBrand)
                    {
                        query.Append(hasSearchTerm ? " AND" : "");
                        query.Append(" Brand = @Brand");
                        parameters.Add("@Brand", brands);
                    }

                    if (hasType)
                    {
                        query.Append((hasSearchTerm || hasBrand) ? " AND" : "");
                        query.Append(" Type = @Type");
                        parameters.Add("@Type", types);
                    }
                }

                switch (sort)
                {
                    case "name_asc":
                        query.Append(" ORDER BY Name ASC");
                        break;
                    case "name_desc":
                        query.Append(" ORDER BY Name DESC");
                        break;
                    case "price_asc":
                        query.Append(" ORDER BY Price ASC");
                        break;
                    case "price_desc":
                        query.Append(" ORDER BY Price DESC");
                        break;
                    default:
                        query.Append(" ORDER BY Id ASC");
                        break;
                }

                int skip = (page - 1) * pageSize;
                int take = pageSize;
                query.Append(" OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY");
                parameters.Add("@Skip", skip);
                parameters.Add("@Take", take);

                var products = await connection.QueryAsync<Product>(query.ToString(), parameters, transaction);

                await transaction.CommitAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new ProblemDetails
                {
                    Title = "Problem getting products",
                    Detail = $"Error occurred while executing command: {ex.Message}"
                });
            }
        }
        [HttpGet("brand-types")]
        public async Task<IActionResult> GetBrandAndTypes()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.OpenAsync();

            try
            {
                using var transaction = await connection.BeginTransactionAsync();
                var brands = await connection.QueryAsync<string>("SELECT DISTINCT Brand FROM Product", transaction: transaction);
                var types = await connection.QueryAsync<string>("SELECT DISTINCT Type FROM Product", transaction: transaction);
                await transaction.CommitAsync();

                var result = new
                {
                    Brands = brands.ToList(),
                    Types = types.ToList()
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Problem getting brand and types",
                    Detail = $"Error occurred while executing command: {ex.Message}"
                });
            }
        }




        //修正前
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
        //テスト
        //[HttpGet("{productId}")]
        //public async Task<ActionResult<IEnumerable<Product>>> GetProduct(int productId)
        //{
        //    using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
        //    var products = await connection.QueryAsync<Product>(
        //        "SELECT * FROM Product WHERE id = @Id",
        //        new { Id = productId }
        //        );
        //    return Ok(products.ToList());
        //}


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
