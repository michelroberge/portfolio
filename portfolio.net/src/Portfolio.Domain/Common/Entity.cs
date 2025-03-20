using System;

namespace Portfolio.Domain.Common;

public abstract class Entity : IEntity
{
    public string Id { get; protected set; }
    public DateTime CreatedAt { get; internal set; }
    public DateTime UpdatedAt { get; internal set; }

    protected Entity()
    {
        Id = Guid.NewGuid().ToString();
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    protected Entity(string id)
    {
        Id = id;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateModifiedDate()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}
