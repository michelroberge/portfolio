using AutoMapper;
using MediatR;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.UseCases.Pages.Queries.GetPageById;

public class GetPageByIdQueryHandler : IRequestHandler<GetPageByIdQuery, PageDto>
{
    private readonly IPageRepository _pageRepository;
    private readonly IMapper _mapper;

    public GetPageByIdQueryHandler(IPageRepository pageRepository, IMapper mapper)
    {
        _pageRepository = pageRepository;
        _mapper = mapper;
    }

    public async Task<PageDto> Handle(GetPageByIdQuery request, CancellationToken cancellationToken)
    {
        var page = await _pageRepository.GetByIdAsync(request.Id, cancellationToken);

        if (page == null)
            throw new NotFoundException(nameof(Page), request.Id.ToString());

        return _mapper.Map<PageDto>(page);
    }
}
