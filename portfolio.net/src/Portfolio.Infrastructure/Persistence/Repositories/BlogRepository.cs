using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Persistence.Repositories;

/// <summary>
/// Repository implementation for Blog entity operations following Clean Architecture principles.
/// Inherits from BaseRepository for common CRUD operations and implements IBlogRepository for blog-specific operations.
/// </summary>
public class BlogRepository : BaseRepository<Blog>, IBlogRepository
{
    public BlogRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Blog?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .FirstOrDefaultAsync(b => b.Slug.ToString() == slug, cancellationToken);
    }

    public async Task<Blog?> GetByLinkAsync(string link, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .FirstOrDefaultAsync(b => b.Link == link, cancellationToken);
    }

    public async Task<IEnumerable<Blog>> GetPublishedAsync(CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Where(b => !b.IsDraft && (!b.PublishAt.HasValue || b.PublishAt <= DateTime.UtcNow))
            .OrderByDescending(b => b.PublishAt ?? b.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Blog>> GetByTagAsync(string tag, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Where(b => b.Tags.Contains(tag))
            .OrderByDescending(b => b.PublishAt ?? b.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetNextVectorIdAsync(CancellationToken cancellationToken = default)
    {
        var maxVectorId = await DbSet
            .MaxAsync(b => (int?)b.VectorId, cancellationToken) ?? 0;
        return maxVectorId + 1;
    }

    public override async Task<IEnumerable<Blog>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await DbSet
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
