using Portfolio.Domain.Entities;

namespace Portfolio.Application.Common.Interfaces;

public interface IPageRepository
{
    Task<Page?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Page?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<IEnumerable<Page>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Guid> CreateAsync(Page page, CancellationToken cancellationToken = default);
    Task UpdateAsync(Page page, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
