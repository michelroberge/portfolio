using Portfolio.Domain.Interfaces;

namespace Portfolio.Domain.Common;

public abstract class Entity : IEntity
{
    public string Id { get; protected set; } = string.Empty;
    public DateTime CreatedAt { get; protected set; }
    public DateTime UpdatedAt { get; protected set; }

    protected Entity()
    {
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    protected Entity(string id)
    {
        Id = id;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}
