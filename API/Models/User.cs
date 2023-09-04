using Microsoft.AspNetCore.Authentication;

namespace API.Models
{
    public class User
    {
        //UserNameは不要？
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public Basket Basket { get; set; }
    }
}
