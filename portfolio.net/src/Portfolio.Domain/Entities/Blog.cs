using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;
using System.Text.RegularExpressions;

namespace Portfolio.Domain.Entities;

public class Blog : Entity
{
    private string _title = string.Empty;
    public string Title 
    { 
        get => _title;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainValidationException("Title cannot be empty");
            if (value.Length > 200)
                throw new DomainValidationException("Title cannot be longer than 200 characters");
            _title = value;
            Link = GenerateLink();
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public string Excerpt { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public bool IsDraft { get; set; } = true;
    public DateTime? PublishAt { get; set; }
    public int VectorId { get; set; }
    public string Link { get; private set; } = string.Empty;
    public List<string> Tags { get; set; } = new();

    private string GenerateLink()
    {
        var slug = Title.ToLowerInvariant();
        // Replace any non-alphanumeric characters with a dash
        slug = Regex.Replace(slug, @"[^a-z0-9]", "-");
        // Remove multiple consecutive dashes
        slug = Regex.Replace(slug, @"-+", "-");
        // Remove leading and trailing dashes
        slug = slug.Trim('-');
        return $"{slug}-{Id}";
    }

    public Blog(
        string id = "",
        string title= "",
        string excerpt = "",
        string body = "",
        bool isDraft =true,
        int vectorId = 0,
        DateTime? publishAt = null,
        string link= ""
    ): base(id)
    {
        Id = id;
        Title = title;
        Excerpt = excerpt;
        Body = body;
        IsDraft = isDraft;
        PublishAt = publishAt;
        Link = link;
        VectorId = vectorId;
    }
}
