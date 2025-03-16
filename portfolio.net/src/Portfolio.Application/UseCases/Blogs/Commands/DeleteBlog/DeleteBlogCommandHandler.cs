using MediatR;
using Microsoft.Extensions.Logging;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Interfaces.Persistence;

namespace Portfolio.Application.UseCases.Blogs.Commands.DeleteBlog;

public class DeleteBlogCommandHandler : IRequestHandler<DeleteBlogCommand, Unit>
{
    private readonly IBlogRepository _blogRepository;
    private readonly ILogger<DeleteBlogCommandHandler> _logger;

    public DeleteBlogCommandHandler(
        IBlogRepository blogRepository,
        ILogger<DeleteBlogCommandHandler> logger)
    {
        _blogRepository = blogRepository ?? throw new ArgumentNullException(nameof(blogRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<Unit> Handle(DeleteBlogCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Deleting blog with ID: {BlogId}", request.Id);

            var blog = await _blogRepository.GetByIdAsync(request.Id, cancellationToken)
                ?? throw new NotFoundException("Blog", request.Id);

            await _blogRepository.DeleteAsync(blog, cancellationToken);
            _logger.LogInformation("Successfully deleted blog with ID: {BlogId}", request.Id);

            return Unit.Value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting blog with ID: {BlogId}", request.Id);
            throw;
        }
    }
}
