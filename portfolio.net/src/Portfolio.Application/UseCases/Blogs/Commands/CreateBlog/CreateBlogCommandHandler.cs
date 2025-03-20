using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.UseCases.Blogs.Commands.CreateBlog;

public class CreateBlogCommandHandler : IRequestHandler<CreateBlogCommand, BlogDto>
{
    private readonly IBlogRepository _blogRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<CreateBlogCommandHandler> _logger;

    public CreateBlogCommandHandler(
        IBlogRepository blogRepository,
        IMapper mapper,
        ILogger<CreateBlogCommandHandler> logger)
    {
        _blogRepository = blogRepository ?? throw new ArgumentNullException(nameof(blogRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BlogDto> Handle(CreateBlogCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creating new blog with title: {Title}", request.Title);

            // Get next vector ID for the blog
            var vectorId = await _blogRepository.GetNextVectorIdAsync(cancellationToken);
            _logger.LogDebug("Retrieved next vector ID: {VectorId}", vectorId);

            // Create new blog entity
            var blog = new Blog(
                title: request.Title,
                excerpt: request.Excerpt,
                body: request.Body,
                publishAt: request.PublishAt
            );

            // Add tags if any
            foreach (var tag in request.Tags)
            {
                blog.Tags.Add(tag);
            }

            _logger.LogDebug("Blog entity created with ID: {BlogId}", blog.Id);

            // Save to repository
            var createdBlog = await _blogRepository.AddAsync(blog, cancellationToken);
            _logger.LogInformation("Successfully created blog with ID: {BlogId}", createdBlog.Id);

            // Map to DTO and return
            return _mapper.Map<BlogDto>(createdBlog);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating blog with title: {Title}", request.Title);
            throw;
        }
    }
}
