using Portfolio.Domain.Entities;

namespace Portfolio.Application.Common.Interfaces;

/// <summary>
/// Repository interface for Blog entity following Clean Architecture principles
/// </summary>
public interface IBlogRepository : IRepository<Blog>
{
    /// <summary>
    /// Gets a blog post by its slug
    /// </summary>
    /// <param name="slug">The URL-friendly slug of the blog post</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The blog post if found, null otherwise</returns>
    Task<Blog?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
