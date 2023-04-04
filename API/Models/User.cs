using Microsoft.AspNetCore.Authentication;

namespace API.Models
{
    public class User
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public Basket Basket { get; set; }
    }
}
