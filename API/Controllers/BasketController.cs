using API.DTOs;
using API.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Data.SqlClient;
using Product = API.Models.Product;
using AutoMapper;
using System.Data;
using System.Transactions;

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
        public async Task<ActionResult<List<BasketDto>>> GetBasketItem(int basketId)
        {
            // データベース接続用の SqlConnection オブジェクトを作成し、OpenAsync メソッドで接続します
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            await connection.OpenAsync();

            // トランザクションを開始します
            var transaction = connection.BeginTransaction();
            try
            {
                var lookup = new Dictionary<int, BasketDto>();

            var sql = @$"SELECT b.*, bi.*, p.Name, p.*
                FROM BasketItem AS bi
                INNER JOIN Basket AS b ON b.Id = bi.BasketId
                INNER JOIN Product AS p ON p.Id = bi.ProductId
                WHERE b.Id = @BasketId";

            var result = await connection.QueryAsync<BasketDto, BasketItemDto, BasketDto>(
                sql,
                (basket, basketItem) =>
                {
                    if (!lookup.TryGetValue(basket.Id, out BasketDto basketDto))
                    {
                        basketDto = basket;
                        basketDto.Items = new List<BasketItemDto>();
                        lookup.Add(basket.Id, basketDto);
                    }

                    var item = new BasketItemDto
                    {
                        ProductId = basketItem.ProductId,
                        Name = basketItem.Name,
                        Price = basketItem.Price,
                        PictureUrl = basketItem.PictureUrl,
                        Brand = basketItem.Brand,
                        Type = basketItem.Type,
                        Quantity = basketItem.Quantity
                    };

                    basketDto.Items.Add(item);

                    return basketDto;
                },
                new { BasketId = basketId },
            splitOn: "ProductId",
                transaction: transaction,
                commandType: CommandType.Text
            );


            return result.ToList();
                //return result.ToList();
                //return res;
            }
            catch
            {
                // トランザクションをロールバックする
                transaction.Rollback();
                throw;
            }

        }



        [HttpPost]
        //TODO: Guid生成できるようになったら引数追加
        //Guid  id
        public async Task<ActionResult<Basket>> AddItemToBasket(int productId, int quantity, string buyerId)
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

                var basket = await connection.QuerySingleOrDefaultAsync<Basket>(@$"
        SELECT * FROM Basket WHERE BuyerId = @BuyerId
        ",
new { BuyerId = buyerId }, transaction);
                //TODO: guid生成したら条件追加
                //Id = @Id

                //修正後
                // select Basket
                // UserId = 'a', Id = 'AFACBFAC-A1EC-4754-B349-1DDA2B98FB21'


                // 取得できなかった場合は、新しいバスケットを作成します
                if (basket == null)
                {
                    basket = new Basket() { Id = basket.Id, BuyerId = basket.BuyerId, Items = basket.Items };

                    await connection.ExecuteAsync("INSERT INTO Basket (Id, BuyerId) VALUES (@Id, @BuyerId)", basket, transaction);
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
                    new { ProductId = productId, BasketId = basket.Id }, transaction);

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
                //return CreatedAtRoute("GetBasket", MapBasketToDto(basket));
                return StatusCode(201);
            }
            catch (Exception ex)
            {
                // 例外が発生した場合は、トランザクションをロールバックして 400 Bad Request エラーを返します
                transaction.Rollback();
                return BadRequest(new ProblemDetails { Title = "Problem adding item to basket", Detail = ex.Message });
            }
        }

        //TODO: Guid生成できるようになったら引数追加
        //Guid  id
                [HttpDelete]
                public async Task<ActionResult> RemoveItem(int productId, int quantity, string buyerId)
        {
            // DBの接続
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();
            //トランザクションの開始
            var transaction = connection.BeginTransaction();

            try
            {
                // 指定されたユーザーの買い物かごを取得
                var basket = await connection.QuerySingleOrDefaultAsync<Basket>(
                //$@"
                //SELECT * FROM Basket WHERE UserId = @UserId and Id = @Id",
                //new { Id = id, UserId = userId }, transaction);
                $@"SELECT* FROM Basket WHERE BuyerId = @BuyerId",
new { BuyerId = buyerId }, transaction);
                // 指定されたユーザーとBasketのIdのBasketItemを取得
                var existItem = await connection.QuerySingleOrDefaultAsync<BasketItem>(
    $@"SELECT * FROM BasketItem WHERE
                        ProductId = @ProductId",
                //new { ProductId = productId, BasketId = basket.Id }, transaction);
                new { ProductId = productId }, transaction);

                //アイテム数の再定義
                var newQuantity = existItem.Quantity - quantity;

                if (newQuantity <= 0)
                {
                    // 変更後の量が0以下の場合、指定のbasketItemを削除する
                    //connection.Execute(
                    //    @"DELETE FROM BasketItem WHERE BasketId = @basketId AND ProductId = @productId",
                    //    new { basketId = basket.Id, productId }, transaction);
                    connection.Execute(
                       @"DELETE FROM BasketItem WHERE ProductId = @productId",
                       new { productId }, transaction);
                }
                else
                {
                    // 変更後のquantityが0以下ではない場合、指定のbasketItemの量をupdateする
                    //                connection.Execute(
                    //@"UPDATE BasketItem SET Quantity = @newQuantity WHERE BasketId = @basketId AND ProductId = @productId",
                    //new { basketId = basket.Id, productId, newQuantity }, transaction);
                    //            }
                    connection.Execute(
    @"UPDATE BasketItem SET Quantity = @newQuantity WHERE ProductId = @productId",
    new { productId, newQuantity }, transaction);
                }

                // トランザクションをコミットして、200 OK を返す
                transaction.Commit();
                return StatusCode(201);
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


    }



}
