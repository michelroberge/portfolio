using Microsoft.AspNetCore.Identity;
using Portfolio.Domain.Entities;
namespace Portfolio.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string UserId { get; set; } = string.Empty;
        public User? UserRecord { get; set; }
    }
}