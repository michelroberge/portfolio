namespace Portfolio.Application.Common.DTOs;

public record UserDto
{
    public required string Id { get; init; }
    public required string Username { get; init; }
    public required string Email { get; init; }
    public string? DisplayName { get; init; }
    public string? AvatarUrl { get; init; }
    public string? Provider { get; init; }
    public string? ProviderId { get; init; }
    public required bool IsAdmin { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
