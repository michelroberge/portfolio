using MediatR;
using Portfolio.Application.Common.Interfaces;
using Portfolio.Application.UseCases.Pages.Common;
using Portfolio.Domain.Common;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.UseCases.Pages.Queries.GetPageBySlug;

public class GetPageBySlugQueryHandler : IRequestHandler<GetPageBySlugQuery, PageDto>
{
    private readonly IPageRepository _pageRepository;

    public GetPageBySlugQueryHandler(IPageRepository pageRepository)
    {
        _pageRepository = pageRepository;
    }

    public async Task<PageDto> Handle(GetPageBySlugQuery request, CancellationToken cancellationToken)
    {
        // Normalize slug for consistency
        var normalizedSlug = request.Slug.Trim().ToLowerInvariant();
        var page = await _pageRepository.GetBySlugAsync(normalizedSlug, cancellationToken);
        
        if (page == null)
            throw new NotFoundException($"Page with slug '{normalizedSlug}' not found", nameof(Page), normalizedSlug);

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
