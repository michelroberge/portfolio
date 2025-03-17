using Portfolio.Domain.Common;
using Portfolio.Domain.ValueObjects;

namespace Portfolio.Application.Interfaces
{
    public interface IApplicationUser : IEntity
    {
        string Username { get; set; }
        string Email { get; set; }
        string FullName { get; set; }
        string? DisplayName { get; set; }
        string? AvatarUrl { get; set; }
        string? Provider { get; set; }
        string? ProviderId { get; set; }
        bool IsAdmin { get; set; }
    }
}
