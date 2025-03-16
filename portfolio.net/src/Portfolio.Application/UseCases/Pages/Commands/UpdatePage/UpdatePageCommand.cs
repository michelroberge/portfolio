using MediatR;
using Portfolio.Application.Common.DTOs;

namespace Portfolio.Application.UseCases.Pages.Commands.UpdatePage;

public record UpdatePageCommand : IRequest<PageDto>
{
    public required string Id { get; init; }
    public required string Title { get; init; }
    public required string Slug { get; init; }
    public required string Content { get; init; }
    public string? MetaDescription { get; init; }
    public IReadOnlyCollection<string>? MetaKeywords { get; init; }
    public string? OpenGraphImage { get; init; }
    public bool? IsDraft { get; init; }
    public bool? IsPublished { get; init; }
}
