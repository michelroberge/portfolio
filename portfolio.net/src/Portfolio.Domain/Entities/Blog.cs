using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;

namespace Portfolio.Domain.Entities;

public class Blog : AuditableEntity
{
    private readonly List<string> _tags;

    public string Title { get; private set; }
    public string Excerpt { get; private set; }
    public string Body { get; private set; }
    public bool IsDraft { get; private set; }
    public DateTime? PublishAt { get; private set; }
    public int VectorId { get; private set; }
    public string Link { get; private set; }
    public IReadOnlyCollection<string> Tags => _tags.AsReadOnly();

    // For EF Core
    private Blog() : base(Guid.NewGuid().ToString())
    {
        Title = string.Empty;
        Excerpt = string.Empty;
        Body = string.Empty;
        Link = string.Empty;
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
        UpdateModifiedDate();
        GenerateLink();
    }

    public void UpdateExcerpt(string excerpt)
    {
        ValidateExcerpt(excerpt);
        Excerpt = excerpt;
        UpdateModifiedDate();
    }

    public void UpdateBody(string body)
    {
        ValidateBody(body);
        Body = body;
        UpdateModifiedDate();
    }

    public void Publish(DateTime? publishAt = null)
    {
        IsDraft = false;
        PublishAt = publishAt;
        UpdateModifiedDate();
    }

    public void UnPublish()
    {
        IsDraft = true;
        PublishAt = null;
        UpdateModifiedDate();
    }

    public void AddTag(string tag)
    {
        if (string.IsNullOrWhiteSpace(tag))
            throw new DomainValidationException("Tag cannot be empty");

        var normalizedTag = tag.Trim().ToLowerInvariant();
        if (!_tags.Contains(normalizedTag))
        {
            _tags.Add(normalizedTag);
            UpdateModifiedDate();
        }
    }

    public void RemoveTag(string tag)
    {
        var normalizedTag = tag.Trim().ToLowerInvariant();
        if (_tags.Remove(normalizedTag))
        {
            UpdateModifiedDate();
        }
    }

    public void ClearTags()
    {
        if (_tags.Any())
        {
            _tags.Clear();
            UpdateModifiedDate();
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
