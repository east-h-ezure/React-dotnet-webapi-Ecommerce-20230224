using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace API.Models
{
    public class Bascket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BascketItem> Items { get; set; } = new();

        private readonly IConfiguration _config;

        public async Task AddItem(int productId, int quantity, SqlConnection connection)
        {
            // Get the product from the database
            var product = await connection.QueryFirstOrDefaultAsync<Product>("SELECT * FROM Product WHERE Id = @ProductId", new { ProductId = productId });

            // Create a new basket item and add it to the basket
            var basketItem = new BascketItem
            {
                Quantity = quantity,
                ProductId = productId,
                Product = product
            };
            Items.Add(basketItem);
        }

        public void AddItem(Product product, int quantity)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();

            // Check if the item is already in the basket
            var existingItem = connection.QueryFirstOrDefault<BascketItem>(
                @"SELECT * FROM BasketItem WHERE BasketId = @basketId AND ProductId = @productId",
                new { basketId = Id, productId = product.Id });

            if (existingItem == null)
            {
                // If the item is not in the basket, insert a new item
                connection.Execute(
                    @"INSERT INTO BasketItem (ProductId, BasketId, Quantity) VALUES (@productId, @basketId, @quantity)",
                    new { productId = product.Id, basketId = Id, quantity });
            }
            else
            {
                // If the item is already in the basket, update the quantity
                connection.Execute(
                    @"UPDATE BasketItem SET Quantity = Quantity + @quantity WHERE BasketId = @basketId AND ProductId = @productId",
                    new { basketId = Id, productId = product.Id, quantity });
            }
        }

        public void RemoveItem(int productId, int quantity)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();

            // Check if the item is in the basket
            var item = connection.QueryFirstOrDefault<BascketItem>(
                @"SELECT * FROM BasketItem WHERE BasketId = @basketId AND ProductId = @productId",
                new { basketId = Id, productId });

            if (item == null) return;

            // Calculate the new quantity
            var newQuantity = item.Quantity - quantity;

            if (newQuantity <= 0)
            {
                // If the new quantity is less than or equal to 0, delete the item
                connection.Execute(
                    @"DELETE FROM BasketItem WHERE BasketId = @basketId AND ProductId = @productId",
                    new { basketId = Id, productId });
            }
            else
            {
                // Otherwise, update the quantity
                connection.Execute(
                    @"UPDATE BasketItem SET Quantity = @newQuantity WHERE BasketId = @basketId AND ProductId = @productId",
                    new { basketId = Id, productId, newQuantity });
            }
        }


    }
}
