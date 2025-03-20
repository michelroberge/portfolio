namespace Portfolio.Application.Common.Models;

/// <summary>
/// Generic class for handling paginated lists
/// </summary>
public class PaginatedList<T>
{
    public IReadOnlyCollection<T> Items { get; }
    public int PageNumber { get; }
    public int TotalPages { get; }
    public int TotalCount { get; }

    public PaginatedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
    {
        PageNumber = pageNumber;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        TotalCount = count;
        Items = items.ToList().AsReadOnly();
    }

    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;

    public static async Task<PaginatedList<T>> CreateAsync(
        IQueryable<T> source, int pageNumber, int pageSize)
    {
        var count = await Task.FromResult(source.Count());
        var items = source.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        return new PaginatedList<T>(items, count, pageNumber, pageSize);
    }
}
