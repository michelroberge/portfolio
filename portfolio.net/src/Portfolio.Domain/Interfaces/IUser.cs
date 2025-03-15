using Portfolio.Domain.ValueObjects;

namespace Portfolio.Domain.Interfaces;

/// <summary>
/// Represents a user in the domain
/// </summary>
public interface IUser : IEntity
{
    string Username { get; }
    Email Email { get; }
    string? DisplayName { get; }
    string? AvatarUrl { get; }
    string? Provider { get; }
    string? ProviderId { get; }
    bool IsAdmin { get; }
    
    void UpdateDisplayName(string? displayName);
    void UpdateAvatarUrl(string? avatarUrl);
    void UpdateProvider(string? provider, string? providerId);
    void SetAdminStatus(bool isAdmin);
}
