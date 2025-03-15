namespace Portfolio.Application.Common.DTOs;

public record ProjectDto
{
    public required string Id { get; init; }
    public required string Title { get; init; }
    public required string Description { get; init; }
    public string? GithubUrl { get; init; }
    public string? LiveUrl { get; init; }
    public string? ImageUrl { get; init; }
    public required int VectorId { get; init; }
    public string? Link { get; init; }
    public IReadOnlyCollection<string> Technologies { get; init; } = Array.Empty<string>();
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
