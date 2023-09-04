using API.Models;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace API.Extentions
{
    public static class ProductExtentions
    {
        public static async Task<IEnumerable<Product>> Sort(this SqlConnection connection, string orderBy, SqlTransaction transaction = null)
        {
            var query = orderBy switch
            {
                "high-price" => "SELECT * FROM Product ORDER BY price DESC",
                "low-price" => "SELECT * FROM Product ORDER BY price ASC",
                _ => "SELECT * FROM Product"
            };

            return await connection.QueryAsync<Product>(query, transaction: transaction);
        }

        public static async Task<IEnumerable<Product>> Search(this SqlConnection connection, string keyword, string orderBy = null, SqlTransaction transaction = null)
        {
            var query = "SELECT * FROM Product WHERE name LIKE @keyword OR description LIKE @keyword";

            if (!string.IsNullOrWhiteSpace(orderBy))
            {
                query += orderBy switch
                {
                    "high-price" => " ORDER BY price DESC",
                    "low-price" => " ORDER BY price ASC",
                    _ => ""
                };
            }

            var result = await connection.QueryAsync<Product>(query, new { keyword = $"%{keyword}%" }, transaction: transaction);
            return result;
        }

    }
}
