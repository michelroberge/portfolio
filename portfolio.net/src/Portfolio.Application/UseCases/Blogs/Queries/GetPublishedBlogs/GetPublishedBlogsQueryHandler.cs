using AutoMapper;
using MediatR;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Interfaces.Persistence;

namespace Portfolio.Application.UseCases.Blogs.Queries.GetPublishedBlogs;

public class GetPublishedBlogsQueryHandler : IRequestHandler<GetPublishedBlogsQuery, IEnumerable<BlogDto>>
{
    private readonly IBlogRepository _blogRepository;
    private readonly IMapper _mapper;

    public GetPublishedBlogsQueryHandler(IBlogRepository blogRepository, IMapper mapper)
    {
        _blogRepository = blogRepository ?? throw new ArgumentNullException(nameof(blogRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<BlogDto>> Handle(GetPublishedBlogsQuery request, CancellationToken cancellationToken)
    {
        var blogs = await _blogRepository.GetPublishedAsync(cancellationToken);
        return _mapper.Map<IEnumerable<BlogDto>>(blogs);
    }
}
