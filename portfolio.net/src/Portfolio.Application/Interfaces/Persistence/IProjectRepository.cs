using Portfolio.Domain.Entities;

namespace Portfolio.Application.Interfaces.Persistence;

/// <summary>
/// Repository interface for Project entity operations
/// </summary>
public interface IProjectRepository : IRepository<Project>
{
    Task<Project?> GetByLinkAsync(string link, CancellationToken cancellationToken = default);
    Task<IEnumerable<Project>> GetByTechnologyAsync(string technology, CancellationToken cancellationToken = default);
    Task<int> GetNextVectorIdAsync(CancellationToken cancellationToken = default);
}
