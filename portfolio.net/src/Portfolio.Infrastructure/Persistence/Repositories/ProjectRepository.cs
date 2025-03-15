using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Persistence.Repositories;

public class ProjectRepository : IProjectRepository
{
    private readonly ApplicationDbContext _context;

    public ProjectRepository(ApplicationDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<Project?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<Project?> GetByLinkAsync(string link, CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .FirstOrDefaultAsync(p => p.Link == link, cancellationToken);
    }

    public async Task<IReadOnlyList<Project>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Project> AddAsync(Project project, CancellationToken cancellationToken = default)
    {
        await _context.Projects.AddAsync(project, cancellationToken);
        return project;
    }

    public Task<Project> UpdateAsync(Project project, CancellationToken cancellationToken = default)
    {
        _context.Entry(project).State = EntityState.Modified;
        return Task.FromResult(project);
    }

    public Task DeleteAsync(Project project, CancellationToken cancellationToken = default)
    {
        _context.Projects.Remove(project);
        return Task.CompletedTask;
    }

    public async Task<int> GetNextVectorIdAsync(CancellationToken cancellationToken = default)
    {
        var maxVectorId = await _context.Projects
            .MaxAsync(p => (int?)p.VectorId, cancellationToken) ?? 0;
        return maxVectorId + 1;
    }

    public async Task<IReadOnlyList<Project>> GetFeaturedAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .Where(p => p.IsFeatured)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
