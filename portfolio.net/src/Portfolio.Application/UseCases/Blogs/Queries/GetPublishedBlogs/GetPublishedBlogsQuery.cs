using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Blogs.Queries.GetPublishedBlogs;

public record GetPublishedBlogsQuery : IQuery<IEnumerable<BlogDto>>
{
    // Add pagination parameters if needed in the future
}
