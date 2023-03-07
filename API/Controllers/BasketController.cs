using API.Dtos;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BasketController : ControllerBase
    {
        private readonly IConfiguration _config;

        public BasketController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<ActionResult<Basket>> GetBasket()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var basket = await connection.QueryFirstOrDefaultAsync<Basket>(
                   $@"
        SELECT 
            Basket.Id as BasketId, 
            Basket.UserId, 
            BasketItem.BasketId as BasketId, 
            BasketItem.ProductId as ProductId,
            Product.Name as ProductName, 
            Product.Price as ProductPrice, 
            Product.Description as ProductDescription
        FROM Basket
        LEFT JOIN BasketItem ON Basket.Id = BasketItem.BasketId
        LEFT JOIN Product ON BasketItem.ProductId = Product.Id"
                   );

            if (basket == null)
            {
                return NotFound();
            }

            return Ok(basket);
        }

        //TODO: 別のコントローラーファイルに移動
//        [Route("api/BasketItem")]
//        [HttpGet]
//        public async Task<ActionResult<BasketItemDto>> GetBasketItem()
//        {
//            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
//            var basket = await connection.QueryFirstOrDefaultAsync<BasketItemDto>(
//                   $@"
//        SELECT 
//            *
//        FROM BasketItem
//        Where
//BasketId = @BasketId"
////,new { BasketId = basket.Id }

//                   //,new { buyerId = Request.Cookies["buyerId"] }
//                   );

//            if (basket == null)
//            {
//                return NotFound();
//            }

//            return Ok(basket);
//        }



            [HttpPost]
        public async Task<IActionResult> AddItemToBasket(int productId, int quantity, string userId, Guid id)
        {
            // データベース接続用の SqlConnection オブジェクトを作成し、OpenAsync メソッドで接続します
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.OpenAsync();

            // トランザクションを開始します
            var transaction = connection.BeginTransaction();

            try
            {
                // 指定されたバスケットの情報を取得します
                //var basket = await connection.QuerySingleOrDefaultAsync<BasketDto>("SELECT * FROM Bacsket WHERE Id = @Id", new { Id = "hoge" }, transaction);
                //修正後
                // insert Basket
                // UserId = 'aa', Id = 'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'
                //guidの生成したものを登録
                //ひとまずベタ打ち
                var basket = await connection.QuerySingleOrDefaultAsync<Basket>("SELECT * FROM Basket WHERE UserId = @UserId and Id = @Id", new { Id = id, UserId = userId }, transaction);
                //修正後
                // select Basket
                // UserId = 'a', Id = 'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'


                // 取得できなかった場合は、新しいバスケットを作成します
                if (basket == null)
                {
                    basket = new Basket() { Id = basket.Id, UserId = basket.UserId };
                    await connection.ExecuteAsync("INSERT INTO Basket (Id, UserId) VALUES (@Id, @UserId)", basket, transaction);
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
                //ユーザーがすでにその商品をBasketItemに追加(存在)しているかどうか
                // var existItem = 
                //select
                //BasketItem
                //basketId, productId
                //
                var existItem = await connection.QuerySingleOrDefaultAsync<BasketItem>(
                    $@"SELECT * FROM BasketItem WHERE
                BasketId = @BasketId and ProductId = @ProductId",
                    new { ProductId = productId, BasketId = basket.Id}, transaction);

                if (existItem != null)
                {
                    existItem.Quantity += quantity;
                    await connection.ExecuteAsync($@"
UPDATE BasketItem
SET
Quantity = @Quantity
WHERE BasketId = @BasketId AND ProductId = @ProductId
", new { Quantity = existItem.Quantity, BasketId = basket.Id, ProductId = productId }, transaction);
                }
                // 既存の商品がない場合は、新しい商品を追加します
                else
                {
                    var newItem = new BasketItem()
                    {
                        BasketId = basket.Id,
                        ProductId = productId,
                        //Name = product.Name,
                        //Price = product.Price,
                        Quantity = quantity,
                        //PictureUrl = product.PictureUrl,
                        //Brand = product.Brand,
                        //Type = product.Type,
                    };
                    var basketItem = await connection.QuerySingleOrDefaultAsync<BasketItem>(
                        $@"SELECT * FROM BasketItem WHERE BasketId = @BasketId and ProductId = @ProductId",
                        new { BasketId = basket.Id, ProductId = productId }, transaction);

                    await connection.ExecuteAsync(
                        "INSERT INTO BasketItem (BasketId, ProductId, Quantity) VALUES (@BasketId, @ProductId, @Quantity)",
                        new { BasketId = basket.Id, ProductId = productId, Quantity = quantity }, transaction);
                }

                // トランザクションをコミットして、200 OK を返します
                transaction.Commit();
                return Ok();
            }
            catch (Exception ex)
            {
                // 例外が発生した場合は、トランザクションをロールバックして 400 Bad Request エラーを返します
                transaction.Rollback();
                return BadRequest(new ProblemDetails { Title = "Problem adding item to basket", Detail = ex.Message });
            }
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItem(int productId, int quantity, string userId, Guid id)
        {
            // DBの接続
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();
            //トランザクションの開始
            var transaction = connection.BeginTransaction();

            try
            {
                // 指定されたユーザーの買い物かごを取得
                var basket = await connection.QuerySingleOrDefaultAsync<Basket>($@"
SELECT * FROM Basket WHERE UserId = @UserId and Id = @Id",
new { Id = id, UserId = userId }, transaction);
                // 指定されたユーザーとBasketのIdのBasketItemを取得
                var existItem = await connection.QuerySingleOrDefaultAsync<BasketItem>(
    $@"SELECT * FROM BasketItem WHERE
                BasketId = @BasketId and ProductId = @ProductId",
    new { ProductId = productId, BasketId = basket.Id }, transaction);

                //アイテム数の再定義
                var newQuantity = existItem.Quantity - quantity;

                if(newQuantity <= 0)
                {
                    // 変更後の量が0以下の場合、指定のbasketItemを削除する
                    connection.Execute(
                        @"DELETE FROM BasketItem WHERE BasketId = @basketId AND ProductId = @productId",
                        new { basketId = basket.Id, productId }, transaction);
                }
                else
                {
                    // 変更後のquantityが0以下ではない場合、指定のbasketItemの量をupdateする
                    connection.Execute(
    @"UPDATE BasketItem SET Quantity = @newQuantity WHERE BasketId = @basketId AND ProductId = @productId",
    new { basketId = basket.Id, productId, newQuantity }, transaction);
                }

                // トランザクションをコミットして、200 OK を返す
                transaction.Commit();
                return Ok();
            }
            catch (Exception ex)
            {
                // 例外が発生した場合は、トランザクションをロールバックして 400 Bad Request エラーを返す
                transaction.Rollback();
                return BadRequest(new ProblemDetails
                {
                    Title = "Problem removing item to basket",
                    Detail = $"Error occurred while executing command: {ex.Message}"
                });
            }

        }



        // TODO: privateメソッド実装して冗長性なくせないか試す

            //private async Task<Basket> RetrieveBasket()
            //{
            //    var buyerId = Request.Cookies["buyerId"];
            //    if (buyerId == null) return null;
            //    //DB接続
            //    using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            //    //ログインしているバスケットの取得
            //    var basket = await connection.QueryFirstOrDefaultAsync<BasketDto>(
            //        "SELECT * FROM Basket WHERE BuyerId = @BuyerId",
            //        new { BuyerId = buyerId });


            //    if (basket != null)
            //    {//バスケットの中身がある場合。バスケットアイテムの中身を取得する
            //        var basketItems = await connection.QueryAsync<BasketItem>(
            //            "SELECT * FROM BasketItem WHERE BasketId = @BasketId",
            //            new { BasketId = basket.Id });
            //        basket.Items = basketItems.ToList();
            //    }
            
            //    return basket;
            //}

        //private async Task<Basket> CreateBasket()
        //{
        //    var buyerId = Guid.NewGuid().ToString();

        //    var cookieOptions = new CookieOptions
        //    {
        //        IsEssential = true,
        //        Expires = DateTime.Now.AddDays(30)
        //    };

        //    if (Response != null)
        //    {
        //        Response.Cookies.Append("buyerId", buyerId, cookieOptions);
        //        return new Basket(_config) { BuyerId = buyerId };
        //    }
        //    else
        //    {
        //        var basket = new Basket(_config) { BuyerId = buyerId };


        //        using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
        //        await connection.ExecuteAsync(
        //            "INSERT INTO Basket (BuyerId) VALUES (@BuyerId)",
        //            new { BuyerId = basket.BuyerId });

        //        basket.Id = (int)await connection.ExecuteScalarAsync("SELECT SCOPE_IDENTITY()");

        //        return basket;
        //    }
        //}





    }


}
