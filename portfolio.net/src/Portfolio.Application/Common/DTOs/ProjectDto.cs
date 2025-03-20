namespace Portfolio.Application.Common.DTOs;

/// <summary>
/// Data Transfer Object for Project entity following Clean Architecture principles.
/// Provides a flat, serializable representation of the Project aggregate.
/// </summary>
public record ProjectDto : BaseDto
{
    public required string Title { get; init; }
    public required string Description { get; init; }
    public string? GithubUrl { get; init; }
    public string? LiveUrl { get; init; }
    public string? ImageUrl { get; init; }
    public required int VectorId { get; init; }
    public string? Link { get; init; }
    public IReadOnlyCollection<string> Technologies { get; init; } = Array.Empty<string>();
}
