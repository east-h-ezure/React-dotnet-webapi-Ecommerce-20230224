using API.Dtos;

public class BasketItemConfirm
{
    public Guid BasketId { get; set; }
    public int Quantity { get; set; }

    public Product Product { get; set; }

    public BasketItemConfirm()
    {
        Product = new Product();
    }


    //修正前
    //public Product Product { get; set; }

    //// SELECT文のフィールド名と一致するプロパティが必要
    //public int ProductId { get; set; }
    //public string Name { get; set; }
    //public string Description { get; set; }
    //public long Price { get; set; }
    //todo: 後で他のプロパティも追加
    //public string? PictureUrl { get; set; }
    //public string? Type { get; set; }
    //public string? Brand { get; set; }
    //public int QuantityInStock { get; set; }
    //public string? Publisher { get; set; }
}
