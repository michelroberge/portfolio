using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Blogs.Queries.GetBlogByLink;

public record GetBlogByLinkQuery : IQuery<BlogDto?>
{
    public required string Link { get; init; }
}
