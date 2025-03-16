using Portfolio.Domain.Entities;

namespace Portfolio.Application.Common.Interfaces;

/// <summary>
/// Repository interface for Project entity following Clean Architecture principles
/// </summary>
public interface IProjectRepository : IRepository<Project>
{
    /// <summary>
    /// Gets a project by its slug
    /// </summary>
    /// <param name="slug">The URL-friendly slug of the project</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The project if found, null otherwise</returns>
    Task<Project?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all featured projects
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A collection of featured projects</returns>
    Task<IEnumerable<Project>> GetFeaturedAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all published projects
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A collection of published projects</returns>
    Task<IEnumerable<Project>> GetPublishedAsync(CancellationToken cancellationToken = default);
}
