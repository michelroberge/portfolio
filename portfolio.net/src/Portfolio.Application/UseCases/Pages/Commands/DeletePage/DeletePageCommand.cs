using MediatR;

namespace Portfolio.Application.UseCases.Pages.Commands.DeletePage;

public record DeletePageCommand(Guid Id) : IRequest<Unit>;
