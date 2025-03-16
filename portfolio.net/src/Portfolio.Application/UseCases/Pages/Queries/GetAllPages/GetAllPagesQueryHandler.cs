using AutoMapper;
using MediatR;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.UseCases.Pages.Queries.GetAllPages;

public class GetAllPagesQueryHandler : IRequestHandler<GetAllPagesQuery, IEnumerable<PageDto>>
{
    private readonly IPageRepository _pageRepository;
    private readonly IMapper _mapper;

    public GetAllPagesQueryHandler(IPageRepository pageRepository, IMapper mapper)
    {
        _pageRepository = pageRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PageDto>> Handle(GetAllPagesQuery request, CancellationToken cancellationToken)
    {
        var pages = await _pageRepository.GetAllAsync(cancellationToken);
        return _mapper.Map<IEnumerable<PageDto>>(pages);
    }
}
