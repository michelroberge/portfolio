namespace Portfolio.Application.Common.DTOs;

/// <summary>
/// Data Transfer Object for Blog entity following Clean Architecture principles.
/// Provides a flat, serializable representation of the Blog aggregate.
/// </summary>
public record BlogDto : BaseDto
{
    public required string Title { get; init; }
    public required string Excerpt { get; init; }
    public required string Body { get; init; }
    public required bool IsDraft { get; init; }
    public DateTime? PublishAt { get; init; }
    public required int VectorId { get; init; }
    public string? Link { get; init; }
    public IReadOnlyCollection<string> Tags { get; init; } = Array.Empty<string>();
}
