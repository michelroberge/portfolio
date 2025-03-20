using MediatR;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.UseCases.Pages.Commands.DeletePage;

public class DeletePageCommandHandler : IRequestHandler<DeletePageCommand, Unit>
{
    private readonly IPageRepository _pageRepository;

    public DeletePageCommandHandler(IPageRepository pageRepository)
    {
        _pageRepository = pageRepository;
    }

    public async Task<Unit> Handle(DeletePageCommand request, CancellationToken cancellationToken)
    {
        // Verify page exists
        var page = await _pageRepository.GetByIdAsync(request.Id, cancellationToken);
        if (page == null)
            throw new NotFoundException(nameof(Page), request.Id);

        // Delete page
        await _pageRepository.DeleteAsync(request.Id, cancellationToken);

        return Unit.Value;
    }
}
