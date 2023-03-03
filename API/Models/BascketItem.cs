using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("BascketItem")]
    public class BascketItem
    {
        public int Id { get; set; }
        public int Quantity { get; set;  }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int BascketId { get; set; }
        public Bascket Bascket { get; set; }
    }
}