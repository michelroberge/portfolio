namespace Portfolio.Application.Common.DTOs;

public record BlogDto
{
    public required string Id { get; init; }
    public required string Title { get; init; }
    public required string Excerpt { get; init; }
    public required string Body { get; init; }
    public required bool IsDraft { get; init; }
    public DateTime? PublishAt { get; init; }
    public required int VectorId { get; init; }
    public string? Link { get; init; }
    public IReadOnlyCollection<string> Tags { get; init; } = Array.Empty<string>();
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
