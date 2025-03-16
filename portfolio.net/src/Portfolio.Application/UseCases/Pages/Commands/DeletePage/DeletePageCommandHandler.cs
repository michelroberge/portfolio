using MediatR;
using Portfolio.Application.Common.Interfaces;
using Portfolio.Domain.Common;
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
        var page = await _pageRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (page == null)
            throw new NotFoundException($"Page with ID {request.Id} not found", nameof(Page), request.Id);

        await _pageRepository.DeleteAsync(request.Id, cancellationToken);
        return Unit.Value;
    }
}
