using Portfolio.Domain.Entities;

namespace Portfolio.Application.Interfaces.Persistence;

/// <summary>
/// Repository interface for Blog entity operations
/// </summary>
public interface IBlogRepository : IRepository<Blog>
{
    Task<Blog?> GetByLinkAsync(string link, CancellationToken cancellationToken = default);
    Task<IEnumerable<Blog>> GetPublishedAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Blog>> GetByTagAsync(string tag, CancellationToken cancellationToken = default);
    Task<int> GetNextVectorIdAsync(CancellationToken cancellationToken = default);
}
