namespace Portfolio.Application.Common.DTOs;

/// <summary>
/// Data Transfer Object for Page entity following Clean Architecture principles.
/// Provides a flat, serializable representation of the Page aggregate.
/// </summary>
public record PageDto
{
    public required string Id { get; init; }
    public required string Title { get; init; }
    public required string Slug { get; init; }
    public required string Content { get; init; }
    public string? MetaDescription { get; init; }
    public IReadOnlyCollection<string> MetaKeywords { get; init; } = Array.Empty<string>();
    public string? OpenGraphImage { get; init; }
    public required bool IsDraft { get; init; }
    public required bool IsPublished { get; init; }
    public required int VectorId { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
