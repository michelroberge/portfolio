namespace Portfolio.Application.UseCases.Pages.Common;

public record PageDto(
    string Id,
    string Title,
    string Slug,
    string Content,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
