using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.Interfaces;

namespace Portfolio.Domain.Entities;

public class Blog : Entity, IBlog
{
    private readonly List<string> _tags;

    public string Title { get; private set; }
    public string Excerpt { get; private set; }
    public string Body { get; private set; }
    public bool IsDraft { get; private set; }
    public DateTime? PublishAt { get; private set; }
    public int VectorId { get; private set; }
    public string? Link { get; private set; }
    public IReadOnlyCollection<string> Tags => _tags.AsReadOnly();

    // For ORM
    private Blog() : base()
    {
        Title = string.Empty;
        Excerpt = string.Empty;
        Body = string.Empty;
        _tags = new List<string>();
    }

    public Blog(
        string id,
        string title,
        string excerpt,
        string body,
        bool isDraft = true,
        DateTime? publishAt = null,
        int vectorId = 0) : base(id)
    {
        ValidateTitle(title);
        ValidateExcerpt(excerpt);
        ValidateBody(body);

        Title = title;
        Excerpt = excerpt;
        Body = body;
        IsDraft = isDraft;
        PublishAt = publishAt;
        VectorId = vectorId;
        _tags = new List<string>();
        
        GenerateLink();
    }

    public void UpdateTitle(string title)
    {
        ValidateTitle(title);
        Title = title;
        UpdatedAt = DateTime.UtcNow;
        GenerateLink();
    }

    public void UpdateExcerpt(string excerpt)
    {
        ValidateExcerpt(excerpt);
        Excerpt = excerpt;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateBody(string body)
    {
        ValidateBody(body);
        Body = body;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDraftStatus(bool isDraft)
    {
        IsDraft = isDraft;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdatePublishDate(DateTime? publishAt)
    {
        PublishAt = publishAt;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddTag(string tag)
    {
        if (string.IsNullOrWhiteSpace(tag))
            throw new DomainValidationException("Tag cannot be empty");

        var normalizedTag = tag.Trim().ToLowerInvariant();
        if (!_tags.Contains(normalizedTag))
        {
            _tags.Add(normalizedTag);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void RemoveTag(string tag)
    {
        var normalizedTag = tag.Trim().ToLowerInvariant();
        if (_tags.Remove(normalizedTag))
        {
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void ClearTags()
    {
        if (_tags.Any())
        {
            _tags.Clear();
            UpdatedAt = DateTime.UtcNow;
        }
    }

    private void GenerateLink()
    {
        var slug = Title.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("_", "-")
            .Replace(".", "-")
            .Replace("/", "-")
            .Replace("\\", "-")
            .Replace(":", "-")
            .Replace(";", "-")
            .Replace("@", "-")
            .Replace("&", "-")
            .Replace("=", "-")
            .Replace("+", "-")
            .Replace("$", "-")
            .Replace("?", "-")
            .Replace("#", "-")
            .Replace("[", "-")
            .Replace("]", "-")
            .Replace("(", "-")
            .Replace(")", "-")
            .Replace("!", "-")
            .Replace("'", "")
            .Replace("\"", "")
            .Replace(",", "")
            .Replace("--", "-")
            .Trim('-');

        Link = $"{slug}-{Id}";
    }

    private static void ValidateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainValidationException("Title cannot be empty");
        
        if (title.Length > 200)
            throw new DomainValidationException("Title cannot be longer than 200 characters");
    }

    private static void ValidateExcerpt(string excerpt)
    {
        if (string.IsNullOrWhiteSpace(excerpt))
            throw new DomainValidationException("Excerpt cannot be empty");
        
        if (excerpt.Length > 500)
            throw new DomainValidationException("Excerpt cannot be longer than 500 characters");
    }

    private static void ValidateBody(string body)
    {
        if (string.IsNullOrWhiteSpace(body))
            throw new DomainValidationException("Body cannot be empty");
    }
}
