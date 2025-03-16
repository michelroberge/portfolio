using MediatR;

namespace Portfolio.Application.UseCases.Pages.Commands.CreatePage;

public record CreatePageCommand(string Title, string Slug, string Content) : IRequest<Guid>;
