namespace Portfolio.Domain.Interfaces;

public interface IEntity
{
    string Id { get; }
    DateTime CreatedAt { get; }
    DateTime UpdatedAt { get; }
}
