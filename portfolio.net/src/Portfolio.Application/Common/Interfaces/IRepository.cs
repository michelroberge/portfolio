namespace Portfolio.Application.Common.Interfaces;

/// <summary>
/// Generic repository interface following Clean Architecture principles
/// </summary>
/// <typeparam name="TEntity">The entity type</typeparam>
public interface IRepository<TEntity> where TEntity : class
{
    /// <summary>
    /// Gets all entities
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A collection of all entities</returns>
    Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets an entity by its ID
    /// </summary>
    /// <param name="id">The entity ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The entity if found, null otherwise</returns>
    Task<TEntity?> GetByIdAsync(string id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds a new entity
    /// </summary>
    /// <param name="entity">The entity to add</param>
    void Add(TEntity entity);

    /// <summary>
    /// Updates an existing entity
    /// </summary>
    /// <param name="entity">The entity to update</param>
    void Update(TEntity entity);

    /// <summary>
    /// Deletes an entity
    /// </summary>
    /// <param name="entity">The entity to delete</param>
    void Delete(TEntity entity);
}
