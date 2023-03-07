using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketItemController
    {
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
        //        FROM BasketItem2
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
    }
}
