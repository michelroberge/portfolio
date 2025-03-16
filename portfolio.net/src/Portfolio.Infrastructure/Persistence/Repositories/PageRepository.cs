using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Common;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Persistence.Repositories;

public class PageRepository : BaseRepository<Page>, IPageRepository
{
    public PageRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Page> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var page = await DbSet
            .FirstOrDefaultAsync(p => p.Slug == slug, cancellationToken);

        if (page == null)
            throw new NotFoundException(typeof(Page).Name, nameof(slug), slug);

        return page;
    }
}
