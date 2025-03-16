namespace Portfolio.Domain.Common;

/// <summary>
/// Base interface for all entities in the domain model.
/// Implements DDD principles by ensuring each entity has a unique identifier.
/// </summary>
public interface IEntity
{
    string Id { get; }
}
