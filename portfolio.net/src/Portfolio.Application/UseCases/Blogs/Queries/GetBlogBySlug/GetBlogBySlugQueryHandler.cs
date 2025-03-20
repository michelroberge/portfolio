using AutoMapper;
using MediatR;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Interfaces.Persistence;

namespace Portfolio.Application.UseCases.Blogs.Queries.GetBlogBySlug;

public class GetBlogBySlugQueryHandler : IRequestHandler<GetBlogBySlugQuery, BlogDto>
{
    private readonly IBlogRepository _blogRepository;
    private readonly IMapper _mapper;

    public GetBlogBySlugQueryHandler(IBlogRepository blogRepository, IMapper mapper)
    {
        _blogRepository = blogRepository;
        _mapper = mapper;
    }

    public async Task<BlogDto> Handle(GetBlogBySlugQuery request, CancellationToken cancellationToken)
    {
        var blog = await _blogRepository.GetBySlugAsync(request.Slug, cancellationToken)
            ?? throw new NotFoundException("Blog", request.Slug);

        return _mapper.Map<BlogDto>(blog);
    }
}
