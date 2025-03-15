namespace Portfolio.Application.Interfaces.Services;

/// <summary>
/// Interface for accessing current user information
/// </summary>
public interface ICurrentUserService
{
    string? UserId { get; }
    string? UserName { get; }
    bool IsAuthenticated { get; }
    bool IsAdmin { get; }
    IReadOnlyList<string> Roles { get; }
}
