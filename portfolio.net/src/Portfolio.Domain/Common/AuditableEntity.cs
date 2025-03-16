using Portfolio.Domain.Interfaces;

namespace Portfolio.Domain.Common;

public abstract class AuditableEntity : IEntity
{
    public string Id { get; private set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    protected AuditableEntity(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new ArgumentException("Entity Id cannot be empty", nameof(id));
        }

        Id = id;
        var now = DateTime.UtcNow;
        CreatedAt = now;
        UpdatedAt = now;
    }

    protected void UpdateModifiedDate()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}
