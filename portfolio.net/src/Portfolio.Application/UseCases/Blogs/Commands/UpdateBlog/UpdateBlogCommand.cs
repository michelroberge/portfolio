using MediatR;
using Portfolio.Application.Common.DTOs;

namespace Portfolio.Application.UseCases.Blogs.Commands.UpdateBlog;

/// <summary>
/// Command to update a blog following CQRS pattern and DDD principles
/// </summary>
public record UpdateBlogCommand : IRequest<BlogDto>
{
    public required string Id { get; init; }
    public required string Title { get; init; }
    public required string Excerpt { get; init; }
    public required string Body { get; init; }
    public bool IsDraft { get; init; }
    public bool IsPublished { get; init; }
    public DateTime? PublishAt { get; init; }
    public IReadOnlyCollection<string> Tags { get; init; } = Array.Empty<string>();
}
