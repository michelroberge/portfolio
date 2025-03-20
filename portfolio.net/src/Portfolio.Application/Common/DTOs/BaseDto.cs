namespace Portfolio.Application.Common.DTOs;

/// <summary>
/// Base DTO for all entities following Clean Architecture principles
/// </summary>
public abstract record BaseDto
{
    public required string Id { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
