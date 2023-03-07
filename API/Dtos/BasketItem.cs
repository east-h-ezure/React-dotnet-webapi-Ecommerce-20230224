namespace API.Dtos
{
    public class BasketItem
    {
        public int ProductId { get; set; }
        public Guid BasketId { get; set; }
        public int Quantity { get; set; }
        //追加
        public Product Product { get; set; }
    }
}