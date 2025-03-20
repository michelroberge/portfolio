using Portfolio.Domain.Common;

namespace Portfolio.Application.Interfaces.Persistence;

/// <summary>
/// Generic repository interface for basic CRUD operations.
/// Follows Clean Architecture principles and Domain-Driven Design patterns.
/// </summary>
public interface IRepository<TEntity> where TEntity : IEntity
{
    Task<TEntity> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(string id, CancellationToken cancellationToken = default);
}
