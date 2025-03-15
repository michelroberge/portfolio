using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Persistence.Repositories;

/// <summary>
/// Repository implementation for Project entity operations following Clean Architecture principles.
/// Inherits from BaseRepository for common CRUD operations and implements IProjectRepository for project-specific operations.
/// </summary>
public class ProjectRepository : BaseRepository<Project>, IProjectRepository
{
    public ProjectRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Project?> GetByLinkAsync(string link, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .FirstOrDefaultAsync(p => p.Link == link, cancellationToken);
    }

    public async Task<IEnumerable<Project>> GetByTechnologyAsync(string technology, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Where(p => p.Technologies.Contains(technology))
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetNextVectorIdAsync(CancellationToken cancellationToken = default)
    {
        var maxVectorId = await DbSet
            .MaxAsync(p => (int?)p.VectorId, cancellationToken) ?? 0;
        return maxVectorId + 1;
    }

    public override async Task<IEnumerable<Project>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await DbSet
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
