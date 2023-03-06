using API.Dtos;
using API.Models;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BascketController : ControllerBase
    {
        private readonly IConfiguration _config;

        public BascketController(IConfiguration config)
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
        public async Task<IActionResult> AddItemToBascket(int productId, int quantity)
        {
            // データベース接続用の SqlConnection オブジェクトを作成し、OpenAsync メソッドで接続します
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.OpenAsync();

            // トランザクションを開始します
            var transaction = connection.BeginTransaction();

            try
            {
                // 指定されたバスケットの情報を取得します
                //var bascket = await connection.QuerySingleOrDefaultAsync<BascketDto>("SELECT * FROM Bacsket WHERE Id = @Id", new { Id = "hoge" }, transaction);
                //修正後
                var bascket = await connection.QuerySingleOrDefaultAsync<BascketDto>("SELECT * FROM Bacsket WHERE Id = @Id", new { Id = productId }, transaction);


                // 取得できなかった場合は、新しいバスケットを作成します
                if (bascket == null)
                {
                    bascket = new BascketDto() { BuyerId = "hoge" };
                    await connection.ExecuteAsync("INSERT INTO Bascket (BuyerId) VALUES (@BuyerId)", bascket, transaction);
                }

                // 指定された商品の情報を取得します
                var product = await connection.QuerySingleOrDefaultAsync<Product>("SELECT * FROM Product WHERE Id = @Id", new { Id = productId }, transaction);

                // 取得できなかった場合は、トランザクションをロールバックして 404 エラーを返します
                if (product == null)
                {
                    transaction.Rollback();
                    return NotFound();
                }

                // 既存の商品がある場合は、数量を加算します
                var existingItem = bascket.Items.FirstOrDefault(item => item.ProductId == productId);
                if (existingItem != null)
                {
                    existingItem.Quantity += quantity;
                    await connection.ExecuteAsync($@"
UPDATE BascketItem
SET
Quantity = @Quantity
WHERE BascketId = @BascketId AND ProductId = @ProductId
", new { Quantity = existingItem.Quantity, BascketId = bascket.Id, ProductId = productId }, transaction);
                }
                // 既存の商品がない場合は、新しい商品を追加します
                else
                {
                    var newItem = new BascketItemDto()
                    {
                        BascketId = bascket.Id,
                        ProductId = productId,
                        Name = product.Name,
                        Price = product.Price,
                        Quantity = quantity,
                        PictureUrl = product.PictureUrl,
                        Brand = product.Brand,
                        Type = product.Type,
                    };

                    bascket.Items.Add(newItem);
                    await connection.ExecuteAsync("INSERT INTO BascketItem (BascketId, ProductId, Name, Price, Quantity, PictureUrl, Brand, Type) VALUES (@BascketId, @ProductId, @Name, @Price, @Quantity, @PictureUrl, @Brand, @Type)", new { BascketId = bascket.Id, ProductId = productId, Name = product.Name, Price = product.Price, Quantity = quantity, PictureUrl = product.PictureUrl, Brand = product.Brand, Type = product.Type }, transaction);
                }

                // トランザクションをコミットして、200 OK を返します
                transaction.Commit();
                return Ok();
            }
            catch (Exception ex)
            {
                // 例外が発生した場合は、トランザクションをロールバックして 400 Bad Request エラーを返します
                transaction.Rollback();
                return BadRequest(new ProblemDetails { Title = "Problem adding item to bascket", Detail = ex.Message });
            }
        }








        [HttpDelete]
        public async Task<ActionResult> RemoveBascketItem(int productId, int quantity = 1)
        {
            var bascket = await RetrieveBascket();

            if (bascket == null) return NotFound();

            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            bascket.RemoveItem(productId, quantity);

            var rowsAffected = await connection.ExecuteAsync(
                "UPDATE BascketItems SET Quantity = @Quantity WHERE BascketId = @BascketId AND ProductId = @ProductId",
                new { Quantity = bascket.Items.Single(x => x.ProductId == productId).Quantity, BascketId = bascket.Id, ProductId = productId });

            if (rowsAffected > 0)
            {
                await connection.ExecuteAsync(
                    "DELETE FROM BascketItems WHERE Quantity = 0 AND BascketId = @BascketId AND ProductId = @ProductId",
                    new { BascketId = bascket.Id, ProductId = productId });

                return Ok();
            }

            return BadRequest(new ProblemDetails { Title = "Problem removing item from the bascket" });
        }




        private async Task<Bascket> RetrieveBascket()
        {
            var buyerId = Request.Cookies["buyerId"];
            if (buyerId == null) return null;

            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var bascket = await connection.QueryFirstOrDefaultAsync<Bascket>(
                "SELECT * FROM Bascket WHERE BuyerId = @BuyerId",
                new { BuyerId = buyerId });

            if (bascket != null)
            {
                var bascketItems = await connection.QueryAsync<BascketItem>(
                    "SELECT * FROM BascketItem WHERE BascketId = @BascketId",
                    new { BascketId = bascket.Id });
                bascket.Items = bascketItems.ToList();
            }

            return bascket;
        }

        private async Task<Bascket> CreateBascket()
        {
            var buyerId = Guid.NewGuid().ToString();

            var cookieOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.Now.AddDays(30)
            };

            if (Response != null)
            {
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
                return new Bascket(_config) { BuyerId = buyerId };
            }
            else
            {
                var bascket = new Bascket(_config) { BuyerId = buyerId };


                using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                await connection.ExecuteAsync(
                    "INSERT INTO Bascket (BuyerId) VALUES (@BuyerId)",
                    new { BuyerId = bascket.BuyerId });

                bascket.Id = (int)await connection.ExecuteScalarAsync("SELECT SCOPE_IDENTITY()");

                return bascket;
            }
        }





    }


}
