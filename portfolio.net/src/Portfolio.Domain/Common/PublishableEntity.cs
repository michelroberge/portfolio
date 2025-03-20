using Portfolio.Domain.Exceptions;

namespace Portfolio.Domain.Common;

/// <summary>
/// Base class for entities that can be published, following DDD principles.
/// Provides common publishing workflow and validation.
/// </summary>
public abstract class PublishableEntity : Entity, IPublishable
{
    public bool IsDraft { get; protected init; }
    public bool IsPublished { get; protected init; }
    public int VectorId { get; protected init; }

    protected PublishableEntity()
    {
        IsDraft = true;
        IsPublished = false;
    }

    protected PublishableEntity(string id) : base(id)
    {
        IsDraft = true;
        IsPublished = false;
    }

    protected virtual void ValidateForPublishing()
    {
        // Base validation, can be overridden by derived classes
    }

    protected void ValidateVectorId(int vectorId)
    {
        if (vectorId <= 0)
            throw new DomainValidationException("Vector ID must be positive");
    }
}
