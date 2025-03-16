namespace Portfolio.Domain.Common;

/// <summary>
/// Interface for entities that can be published, following DDD principles.
/// Defines the contract for publishing workflow.
/// </summary>
public interface IPublishable
{
    bool IsDraft { get; }
    bool IsPublished { get; }
    int VectorId { get; }
}
