using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Persistence.Repositories;

public class BlogRepository : BaseRepository<Blog>, IBlogRepository
{
    public BlogRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Blog?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
    }

    public async Task<Blog?> GetByLinkAsync(string link, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .FirstOrDefaultAsync(b => b.Link == link, cancellationToken);
    }

    public async Task<IEnumerable<Blog>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await DbSet
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Blog>> GetPublishedAsync(CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Where(b => !b.IsDraft && (!b.PublishAt.HasValue || b.PublishAt <= DateTime.UtcNow))
            .OrderByDescending(b => b.PublishAt ?? b.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Blog> AddAsync(Blog blog, CancellationToken cancellationToken = default)
    {
        await DbSet.AddAsync(blog, cancellationToken);
        return blog;
    }

    public Task<Blog> UpdateAsync(Blog blog, CancellationToken cancellationToken = default)
    {
        Entry(blog).State = EntityState.Modified;
        return Task.FromResult(blog);
    }

    public Task DeleteAsync(Blog blog, CancellationToken cancellationToken = default)
    {
        DbSet.Remove(blog);
        return Task.CompletedTask;
    }

    public async Task<int> GetNextVectorIdAsync(CancellationToken cancellationToken = default)
    {
        var maxVectorId = await DbSet
            .MaxAsync(b => (int?)b.VectorId, cancellationToken) ?? 0;
        return maxVectorId + 1;
    }
}
