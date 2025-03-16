using MediatR;

namespace Portfolio.Application.UseCases.Pages.Commands.UpdatePage;

public record UpdatePageCommand : IRequest<Unit>
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
}
