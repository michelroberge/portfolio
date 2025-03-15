using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Blogs.Commands.CreateBlog;

public record CreateBlogCommand : ICommand<BlogDto>
{
    public required string Title { get; init; }
    public required string Excerpt { get; init; }
    public required string Body { get; init; }
    public bool IsDraft { get; init; }
    public DateTime? PublishAt { get; init; }
    public IReadOnlyCollection<string> Tags { get; init; } = Array.Empty<string>();
}
