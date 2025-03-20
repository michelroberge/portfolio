using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Interfaces.Persistence;

namespace Portfolio.Application.UseCases.Blogs.Queries.GetBlogByLink;

public class GetBlogByLinkQueryHandler : IRequestHandler<GetBlogByLinkQuery, BlogDto?>
{
    private readonly IBlogRepository _blogRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetBlogByLinkQueryHandler> _logger;

    public GetBlogByLinkQueryHandler(
        IBlogRepository blogRepository,
        IMapper mapper,
        ILogger<GetBlogByLinkQueryHandler> logger)
    {
        _blogRepository = blogRepository ?? throw new ArgumentNullException(nameof(blogRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BlogDto?> Handle(GetBlogByLinkQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Fetching blog with link: {Link}", request.Link);

            var blog = await _blogRepository.GetByLinkAsync(request.Link, cancellationToken);

            if (blog == null)
            {
                _logger.LogWarning("Blog with link {Link} not found", request.Link);
                return null;
            }

            _logger.LogDebug("Successfully retrieved blog with ID: {BlogId}", blog.Id);
            return _mapper.Map<BlogDto>(blog);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching blog with link: {Link}", request.Link);
            throw;
        }
    }
}
