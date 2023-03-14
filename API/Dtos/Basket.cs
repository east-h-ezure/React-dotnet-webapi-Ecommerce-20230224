namespace API.Dtos
{
    public class Basket
    {
        public string UserId { get; set; } 
        public Guid Id { get; set; }
        //追加
        public List<BasketItem> Items { get; set; }

        //public Basket()
        //{
        //    Items = new List<BasketItem>();
        //}
    }
}
