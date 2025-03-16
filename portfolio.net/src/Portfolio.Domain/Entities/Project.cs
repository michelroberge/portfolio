using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;

namespace Portfolio.Domain.Entities;

/// <summary>
/// Represents a project entity.
/// </summary>
public class Project : Entity
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
            UpdatedAt = DateTime.UtcNow;
        }
    }

    private string _link = string.Empty;
    public string Link 
    { 
        get => _link;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainValidationException("Link cannot be empty");
            if (value.Length > 200)
                throw new DomainValidationException("Link cannot be longer than 200 characters");
            _link = value;
            UpdatedAt = DateTime.UtcNow;
        }
    }

    private string? _githubUrl;
    public string? GithubUrl 
    { 
        get => _githubUrl;
        set
        {
            ValidateUrl(value, nameof(GithubUrl));
            _githubUrl = value;
            UpdatedAt = DateTime.UtcNow;
        }
    }

    private string? _liveUrl;
    public string? LiveUrl 
    { 
        get => _liveUrl;
        set
        {
            ValidateUrl(value, nameof(LiveUrl));
            _liveUrl = value;
            UpdatedAt = DateTime.UtcNow;
        }
    }

    private string? _imageUrl;
    public string? ImageUrl 
    { 
        get => _imageUrl;
        set
        {
            ValidateUrl(value, nameof(ImageUrl));
            _imageUrl = value;
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public string Description { get; set; } = string.Empty;
    public bool IsDraft { get; set; } = true;
    public bool IsFeatured { get; set; }
    public int VectorId { get; set; }
    public List<string> Technologies { get; set; } = new();

    private static void ValidateUrl(string? url, string paramName)
    {
        if (string.IsNullOrWhiteSpace(url))
            return;

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uriResult) || 
            (uriResult.Scheme != Uri.UriSchemeHttp && uriResult.Scheme != Uri.UriSchemeHttps))
        {
            throw new DomainValidationException($"{paramName} must be a valid HTTP/HTTPS URL");
        }
    }

    // For EF Core
    private Project() : base()
    {
        Title = string.Empty;
        Link = string.Empty;
        Technologies = new List<string>();
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="Project"/> class.
    /// </summary>
    public Project(
        string id,
        string title,
        string link,
        string? githubUrl = null,
        string? liveUrl = null,
        string? imageUrl = null,
        bool isDraft = true,
        bool isFeatured = false,
        string description = "",
        int vectorId = 0) : base(id)
    {
        Title = title;
        Link = link;
        GithubUrl = githubUrl;
        LiveUrl = liveUrl;
        ImageUrl = imageUrl;
        IsDraft = isDraft;
        IsFeatured = isFeatured;
        VectorId = vectorId;
        Description = description;
    }
}
