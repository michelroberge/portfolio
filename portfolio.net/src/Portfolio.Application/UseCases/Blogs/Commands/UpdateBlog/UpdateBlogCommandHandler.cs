using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.UseCases.Blogs.Commands.UpdateBlog;

public class UpdateBlogCommandHandler : IRequestHandler<UpdateBlogCommand, BlogDto>
{
    private readonly IBlogRepository _blogRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<UpdateBlogCommandHandler> _logger;

    public UpdateBlogCommandHandler(
        IBlogRepository blogRepository,
        IMapper mapper,
        ILogger<UpdateBlogCommandHandler> logger)
    {
        _blogRepository = blogRepository ?? throw new ArgumentNullException(nameof(blogRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BlogDto> Handle(UpdateBlogCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Updating blog with ID: {BlogId}", request.Id);

            var existingBlog = await _blogRepository.GetByIdAsync(request.Id, cancellationToken)
                ?? throw new NotFoundException("Blog", request.Id);

            // Update blog using domain entity's Update method following DDD principles
            var updatedBlog = existingBlog.Update(
                title: request.Title,
                excerpt: request.Excerpt,
                body: request.Body,
                publishAt: request.PublishAt,
                tags: request.Tags.ToList(),
                isDraft: request.IsDraft
            );

            _logger.LogDebug("Blog entity updated with ID: {BlogId}", updatedBlog.Id);

            // Save to repository
            await _blogRepository.UpdateAsync(updatedBlog, cancellationToken);
            _logger.LogInformation("Successfully updated blog with ID: {BlogId}", request.Id);

            // Map to DTO and return
            return _mapper.Map<BlogDto>(await _blogRepository.GetByIdAsync(request.Id));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating blog with ID: {BlogId}", request.Id);
            throw;
        }
    }
}
