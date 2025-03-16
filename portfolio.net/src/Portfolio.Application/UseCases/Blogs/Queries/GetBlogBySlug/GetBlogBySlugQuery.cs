using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Blogs.Queries.GetBlogBySlug;

/// <summary>
/// Query to retrieve a blog post by its slug following CQRS pattern
/// </summary>
public record GetBlogBySlugQuery(string Slug) : IQuery<BlogDto>;
