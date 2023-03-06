using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace API.Models
{
    public class Bascket
    {
        public int Id { get; set; }
        public string? BuyerId { get; set; }
        public List<BascketItem> Items { get; set; } = new();


        private readonly IConfiguration _config;

        public Bascket(IConfiguration config)
        {
            _config = config;
        }

        public async Task AddItem(int productId, int quantity, SqlConnection connection)
        {
            // Get the product from the database
            var product = await connection.QueryFirstOrDefaultAsync<Product>("SELECT * FROM Product WHERE Id = @ProductId", new { ProductId = productId });

            // Create a new bascket item and add it to the bascket
            var bascketItem = new BascketItem
            {
                Quantity = quantity,
                ProductId = productId,
                Product = product
            };
            Items.Add(bascketItem);
        }

        public void AddItem(Product product, int quantity)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();

            // Check if the item is already in the bascket
            var existingItem = connection.QueryFirstOrDefault<BascketItem>(
                @"SELECT * FROM BascketItem WHERE BascketId = @bascketId AND ProductId = @productId",
                new { bascketId = Id, productId = product.Id });

            if (existingItem == null)
            {
                // If the item is not in the bascket, insert a new item
                connection.Execute(
                    @"INSERT INTO BascketItem (ProductId, BascketId, Quantity) VALUES (@productId, @bascketId, @quantity)",
                    new { productId = product.Id, bascketId = Id, quantity });
            }
            else
            {
                // If the item is already in the bascket, update the quantity
                connection.Execute(
                    @"UPDATE BascketItem SET Quantity = Quantity + @quantity WHERE BascketId = @bascketId AND ProductId = @productId",
                    new { bascketId = Id, productId = product.Id, quantity });
            }
        }

        public void RemoveItem(int productId, int quantity)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();

            // Check if the item is in the bascket
            var item = connection.QueryFirstOrDefault<BascketItem>(
                @"SELECT * FROM BascketItem WHERE BascketId = @bascketId AND ProductId = @productId",
                new { bascketId = Id, productId });

            if (item == null) return;

            // Calculate the new quantity
            var newQuantity = item.Quantity - quantity;

            if (newQuantity <= 0)
            {
                // If the new quantity is less than or equal to 0, delete the item
                connection.Execute(
                    @"DELETE FROM BascketItem WHERE BascketId = @bascketId AND ProductId = @productId",
                    new { bascketId = Id, productId });
            }
            else
            {
                // Otherwise, update the quantity
                connection.Execute(
                    @"UPDATE BascketItem SET Quantity = @newQuantity WHERE BascketId = @bascketId AND ProductId = @productId",
                    new { bascketId = Id, productId, newQuantity });
            }
        }


    }
}
