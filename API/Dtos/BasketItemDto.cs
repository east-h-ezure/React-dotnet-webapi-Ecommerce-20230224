namespace API.DTOs
{
    public class BasketItemDto {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public long ProductPrice { get; set; }
        public string ProductPictureUrl { get; set; }
        public string ProductBrand { get; set; }
        public string ProductType { get; set; }
        public int Quantity { get; set; }
}
}