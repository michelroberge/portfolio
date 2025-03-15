using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.Interfaces;

namespace Portfolio.Domain.Entities;

public class Project : Entity, IProject
{
    private readonly List<string> _technologies;

    public string Title { get; private set; }
    public string Description { get; private set; }
    public string? GithubUrl { get; private set; }
    public string? LiveUrl { get; private set; }
    public string? ImageUrl { get; private set; }
    public int VectorId { get; private set; }
    public string? Link { get; private set; }
    public IReadOnlyCollection<string> Technologies => _technologies.AsReadOnly();

    // For ORM
    private Project() : base()
    {
        Title = string.Empty;
        Description = string.Empty;
        _technologies = new List<string>();
    }

    public Project(
        string id,
        string title,
        string description,
        string? githubUrl = null,
        string? liveUrl = null,
        string? imageUrl = null,
        int vectorId = 0) : base(id)
    {
        ValidateTitle(title);
        ValidateDescription(description);
        ValidateUrl(githubUrl, nameof(githubUrl));
        ValidateUrl(liveUrl, nameof(liveUrl));
        ValidateUrl(imageUrl, nameof(imageUrl));

        Title = title;
        Description = description;
        GithubUrl = githubUrl;
        LiveUrl = liveUrl;
        ImageUrl = imageUrl;
        VectorId = vectorId;
        _technologies = new List<string>();
        
        GenerateLink();
    }

    public void UpdateTitle(string title)
    {
        ValidateTitle(title);
        Title = title;
        UpdatedAt = DateTime.UtcNow;
        GenerateLink();
    }

    public void UpdateDescription(string description)
    {
        ValidateDescription(description);
        Description = description;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateGithubUrl(string? githubUrl)
    {
        ValidateUrl(githubUrl, nameof(githubUrl));
        GithubUrl = githubUrl;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateLiveUrl(string? liveUrl)
    {
        ValidateUrl(liveUrl, nameof(liveUrl));
        LiveUrl = liveUrl;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateImageUrl(string? imageUrl)
    {
        ValidateUrl(imageUrl, nameof(imageUrl));
        ImageUrl = imageUrl;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddTechnology(string technology)
    {
        if (string.IsNullOrWhiteSpace(technology))
            throw new DomainValidationException("Technology cannot be empty");

        var normalizedTechnology = technology.Trim().ToLowerInvariant();
        if (!_technologies.Contains(normalizedTechnology))
        {
            _technologies.Add(normalizedTechnology);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void RemoveTechnology(string technology)
    {
        var normalizedTechnology = technology.Trim().ToLowerInvariant();
        if (_technologies.Remove(normalizedTechnology))
        {
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void ClearTechnologies()
    {
        if (_technologies.Any())
        {
            _technologies.Clear();
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

    private static void ValidateDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new DomainValidationException("Description cannot be empty");
        
        if (description.Length > 2000)
            throw new DomainValidationException("Description cannot be longer than 2000 characters");
    }

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
}
