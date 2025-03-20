using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Portfolio.Application.Interfaces.Persistence;

namespace Portfolio.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork, IDisposable
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _currentTransaction;
    private bool _disposed;

    public IBlogRepository Blogs { get; }
    public IProjectRepository Projects { get; }
    public IUserRepository Users { get; }

    public UnitOfWork(
        ApplicationDbContext context,
        IBlogRepository blogRepository,
        IProjectRepository projectRepository,
        IUserRepository userRepository)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        Blogs = blogRepository ?? throw new ArgumentNullException(nameof(blogRepository));
        Projects = projectRepository ?? throw new ArgumentNullException(nameof(projectRepository));
        Users = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction != null)
        {
            return;
        }

        _currentTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await _context.SaveChangesAsync(cancellationToken);

            if (_currentTransaction != null)
            {
                await _currentTransaction.CommitAsync(cancellationToken);
            }
        }
        catch
        {
            await RollbackTransactionAsync(cancellationToken);
            throw;
        }
        finally
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.DisposeAsync();
                _currentTransaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction != null)
        {
            await _currentTransaction.RollbackAsync(cancellationToken);
            await _currentTransaction.DisposeAsync();
            _currentTransaction = null;
        }
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed && disposing)
        {
            _context.Dispose();
            _currentTransaction?.Dispose();
        }
        _disposed = true;
    }
}
