using MediatR;
using Portfolio.Application.Common.Interfaces;
using Portfolio.Application.UseCases.Pages.Common;
using Portfolio.Domain.Common;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.UseCases.Pages.Queries.GetPageById;

public class GetPageByIdQueryHandler : IRequestHandler<GetPageByIdQuery, PageDto>
{
    private readonly IPageRepository _pageRepository;

    public GetPageByIdQueryHandler(IPageRepository pageRepository)
    {
        _pageRepository = pageRepository;
    }

    public async Task<PageDto> Handle(GetPageByIdQuery request, CancellationToken cancellationToken)
    {
        var page = await _pageRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (page == null)
            throw new NotFoundException($"Page with ID {request.Id} not found", nameof(Page), request.Id);

        // Map domain entity to DTO
        return new PageDto(
            page.Id,
            page.Title,
            page.Slug,
            page.Content,
            page.CreatedAt,
            page.UpdatedAt);
    }
}
