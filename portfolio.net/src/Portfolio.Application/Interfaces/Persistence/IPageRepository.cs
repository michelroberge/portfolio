using Portfolio.Domain.Entities;

namespace Portfolio.Application.Interfaces.Persistence;

public interface IPageRepository: IRepository<Page>
{
    Task<Page> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
