using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Blogs.Queries.GetBlogById;

/// <summary>
/// Query to retrieve a blog post by its ID following CQRS pattern
/// </summary>
public record GetBlogByIdQuery(string Id) : IQuery<BlogDto>;
