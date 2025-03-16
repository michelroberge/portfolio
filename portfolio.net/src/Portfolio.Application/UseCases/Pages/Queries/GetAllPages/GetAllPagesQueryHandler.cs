using MediatR;
using Portfolio.Application.Common.Interfaces;
using Portfolio.Application.UseCases.Pages.Common;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.UseCases.Pages.Queries.GetAllPages;

public class GetAllPagesQueryHandler : IRequestHandler<GetAllPagesQuery, IEnumerable<PageDto>>
{
    private readonly IPageRepository _pageRepository;

    public GetAllPagesQueryHandler(IPageRepository pageRepository)
    {
        _pageRepository = pageRepository;
    }

    public async Task<IEnumerable<PageDto>> Handle(GetAllPagesQuery request, CancellationToken cancellationToken)
    {
        // Get all pages from repository
        var pages = await _pageRepository.GetAllAsync(cancellationToken);
        
        // Map domain entities to DTOs, handle null case
        return pages?.Select(page => new PageDto(
            page.Id,
            page.Title,
            page.Slug,
            page.Content,
            page.CreatedAt,
            page.UpdatedAt)) ?? Enumerable.Empty<PageDto>();
    }
}
