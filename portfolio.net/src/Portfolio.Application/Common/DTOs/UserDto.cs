namespace Portfolio.Application.Common.DTOs;

/// <summary>
/// Data Transfer Object for User entity following Clean Architecture principles.
/// Provides a flat, serializable representation of the User aggregate.
/// </summary>
public record UserDto : BaseDto
{
    public required string Username { get; init; }
    public required string Email { get; init; }
    public string? DisplayName { get; init; }
    public string? AvatarUrl { get; init; }
    public string? Provider { get; init; }
    public string? ProviderId { get; init; }
    public required bool IsAdmin { get; init; }
}
