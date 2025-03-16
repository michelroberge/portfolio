using AutoMapper;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Blogs.Queries.GetAllBlogs;

public class GetAllBlogsQueryHandler : IRequestHandler<GetAllBlogsQuery, IEnumerable<BlogDto>>
{
    private readonly IBlogRepository _blogRepository;
    private readonly IMapper _mapper;

    public GetAllBlogsQueryHandler(IBlogRepository blogRepository, IMapper mapper)
    {
        _blogRepository = blogRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BlogDto>> Handle(GetAllBlogsQuery request, CancellationToken cancellationToken)
    {
        var blogs = await _blogRepository.GetAllAsync(cancellationToken);
        return _mapper.Map<IEnumerable<BlogDto>>(blogs);
    }
}
