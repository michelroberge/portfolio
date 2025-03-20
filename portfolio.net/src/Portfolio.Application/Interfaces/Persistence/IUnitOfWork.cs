namespace Portfolio.Application.Interfaces.Persistence;

/// <summary>
/// Interface for managing transactions and unit of work pattern
/// </summary>
public interface IUnitOfWork
{
    IBlogRepository Blogs { get; }
    IProjectRepository Projects { get; }
    IUserRepository Users { get; }

    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
