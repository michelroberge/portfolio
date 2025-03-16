using MediatR;

namespace Portfolio.Application.UseCases.Pages.Commands.DeletePage;

public record DeletePageCommand(string Id) : IRequest<Unit>;
