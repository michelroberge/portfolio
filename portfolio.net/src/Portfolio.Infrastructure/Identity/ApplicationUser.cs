using Microsoft.AspNetCore.Identity;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.ValueObjects;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;
namespace Portfolio.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string UserId { get; set; } = string.Empty;
        public User? UserRecord { get; set; }
    }
}