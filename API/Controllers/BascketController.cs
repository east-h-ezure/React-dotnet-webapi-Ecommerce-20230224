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
        public async Task<ActionResult<BascketDto>> GetBascket()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var bascket = await connection.QueryFirstOrDefaultAsync<BascketDto>(
                   $@"
        SELECT 
            Bascket2.Id as BascketId, 
            Bascket2.UserId, 
            BascketItem2.BascketId as BascketId, 
            BascketItem2.ProductId as ProductId,
            Product.Name as ProductName, 
            Product.Price as ProductPrice, 
            Product.Description as ProductDescription
        FROM Bascket2
        LEFT JOIN BascketItem2 ON Bascket2.Id = BascketItem2.BascketId
        LEFT JOIN Product ON BascketItem2.ProductId = Product.Id"
                   //"WHERE Bascket2.UserId = 'aa' and Bascket2.Id = Product.Id"
                   //,new { buyerId = Request.Cookies["buyerId"] }
                   );

            if (bascket == null)
            {
                return NotFound();
            }

            return Ok(bascket);
        }

        //TODO: 別のコントローラーファイルに移動
//        [Route("api/BascketItem")]
//        [HttpGet]
//        public async Task<ActionResult<BascketItemDto>> GetBascketItem()
//        {
//            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
//            var bascket = await connection.QueryFirstOrDefaultAsync<BascketItemDto>(
//                   $@"
//        SELECT 
//            *
//        FROM BascketItem2
//        Where
//BascketId = @BascketId"
////,new { BascketId = bascket.Id }

//                   //,new { buyerId = Request.Cookies["buyerId"] }
//                   );

//            if (bascket == null)
//            {
//                return NotFound();
//            }

//            return Ok(bascket);
//        }



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
                // insert Basket
                // UserId = 'aa', Id = 'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'
                //guidの生成したものを登録
                //ひとまずベタ打ち
                var bascket = await connection.QuerySingleOrDefaultAsync<BascketDto>("SELECT * FROM Bascket2 WHERE UserId = @UserId and Id = @Id", new { Id = "AFACBFAC-A1EC-4754-B349-1DDA2B98FB21", UserId = "aa"  }, transaction);
                //修正後
                // select Basket
                // UserId = 'a', Id = 'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'


                // 取得できなかった場合は、新しいバスケットを作成します
                if (bascket == null)
                {
                    bascket = new BascketDto() { Id = bascket.Id, UserId = bascket.UserId };
                    await connection.ExecuteAsync("INSERT INTO Bascket2 (Id, UserId) VALUES (@Id, @UserId)", bascket, transaction);
                    //修正後
                    // insert Basket
                    // USerId = 'a', Id = 'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'
                    //本番ではguidの生成したものを登録
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
                //ユーザーがすでにその商品をBascketItemに追加(存在)しているかどうか
                // var existItem = 
                //select
                //BascketItem
                //bascketId, productId
                //
                var existItem = await connection.QuerySingleOrDefaultAsync<BascketItemDto>(
                    $@"SELECT * FROM BascketItem2 WHERE
                BascketId = @BascketId and ProductId = @ProductId",
                    new { ProductId = productId, BascketId = bascket.Id}, transaction);

                if (existItem != null)
                {
                    existItem.Quantity += quantity;
                    await connection.ExecuteAsync($@"
UPDATE BascketItem2
SET
Quantity = @Quantity
WHERE BascketId = @BascketId AND ProductId = @ProductId
", new { Quantity = existItem.Quantity, BascketId = bascket.Id, ProductId = productId }, transaction);
                }
                // 既存の商品がない場合は、新しい商品を追加します
                else
                {
                    var newItem = new BascketItemDto()
                    {
                        BascketId = bascket.Id,
                        ProductId = productId,
                        //Name = product.Name,
                        //Price = product.Price,
                        Quantity = quantity,
                        //PictureUrl = product.PictureUrl,
                        //Brand = product.Brand,
                        //Type = product.Type,
                    };
                    var bascketItem = await connection.QuerySingleOrDefaultAsync<BascketItemDto>(
                        $@"SELECT * FROM BascketItem2 WHERE BascketId = @BascketId and ProductId = @ProductId",
                        new { BascketId = bascket.Id, ProductId = productId }, transaction);
                    //bascket.Item.Add(newItem);

                    await connection.ExecuteAsync(
                        "INSERT INTO BascketItem2 (BascketId, ProductId, Quantity) VALUES (@BascketId, @ProductId, @Quantity)",
                        new { BascketId = bascket.Id, ProductId = productId, Quantity = quantity }, transaction);
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
