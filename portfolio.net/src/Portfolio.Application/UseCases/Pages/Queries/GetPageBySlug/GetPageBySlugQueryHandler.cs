using AutoMapper;
using MediatR;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.UseCases.Pages.Queries.GetPageBySlug;

public class GetPageBySlugQueryHandler : IRequestHandler<GetPageBySlugQuery, PageDto>
{
    private readonly IPageRepository _pageRepository;
    private readonly IMapper _mapper;

    public GetPageBySlugQueryHandler(IPageRepository pageRepository, IMapper mapper)
    {
        _pageRepository = pageRepository;
        _mapper = mapper;
    }

    public async Task<PageDto> Handle(GetPageBySlugQuery request, CancellationToken cancellationToken)
    {
        var page = await _pageRepository.GetBySlugAsync(request.Slug, cancellationToken);

        if (page == null)
            throw new NotFoundException(nameof(Page), request.Slug);

        return _mapper.Map<PageDto>(page);
    }
}
