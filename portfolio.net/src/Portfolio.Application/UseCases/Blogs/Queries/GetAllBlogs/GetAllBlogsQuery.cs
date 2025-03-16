using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Blogs.Queries.GetAllBlogs;

/// <summary>
/// Query to retrieve all blog posts following CQRS pattern
/// </summary>
public record GetAllBlogsQuery : IQuery<IEnumerable<BlogDto>>;
