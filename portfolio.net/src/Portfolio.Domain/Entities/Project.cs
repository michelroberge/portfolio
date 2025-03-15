using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;

namespace Portfolio.Domain.Entities;

/// <summary>
/// Represents a project entity.
/// </summary>
public class Project : AuditableEntity
{
    private readonly List<string> _technologies;

    /// <summary>
    /// Gets or sets the title of the project.
    /// </summary>
    public string Title { get; private set; }

    /// <summary>
    /// Gets or sets the description of the project.
    /// </summary>
    public string Description { get; private set; }

    /// <summary>
    /// Gets or sets the GitHub URL of the project.
    /// </summary>
    public string? GithubUrl { get; private set; }

    /// <summary>
    /// Gets or sets the live URL of the project.
    /// </summary>
    public string? LiveUrl { get; private set; }

    /// <summary>
    /// Gets or sets the image URL of the project.
    /// </summary>
    public string? ImageUrl { get; private set; }

    /// <summary>
    /// Gets or sets a value indicating whether the project is a draft.
    /// </summary>
    public bool IsDraft { get; private set; }

    /// <summary>
    /// Gets or sets a value indicating whether the project is featured.
    /// </summary>
    public bool IsFeatured { get; private set; }

    /// <summary>
    /// Gets or sets the vector ID of the project.
    /// </summary>
    public int VectorId { get; private set; }

    /// <summary>
    /// Gets or sets the link of the project.
    /// </summary>
    public string Link { get; private set; }

    /// <summary>
    /// Gets the technologies used in the project.
    /// </summary>
    public IReadOnlyCollection<string> Technologies => _technologies.AsReadOnly();

    // For EF Core
    private Project() : base(Guid.NewGuid().ToString())
    {
        Title = string.Empty;
        Description = string.Empty;
        Link = string.Empty;
        _technologies = new List<string>();
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="Project"/> class.
    /// </summary>
    /// <param name="id">The ID of the project.</param>
    /// <param name="title">The title of the project.</param>
    /// <param name="description">The description of the project.</param>
    /// <param name="link">The link of the project.</param>
    /// <param name="githubUrl">The GitHub URL of the project.</param>
    /// <param name="liveUrl">The live URL of the project.</param>
    /// <param name="imageUrl">The image URL of the project.</param>
    /// <param name="isDraft">A value indicating whether the project is a draft.</param>
    /// <param name="isFeatured">A value indicating whether the project is featured.</param>
    /// <param name="vectorId">The vector ID of the project.</param>
    public Project(
        string id,
        string title,
        string description,
        string link,
        string? githubUrl = null,
        string? liveUrl = null,
        string? imageUrl = null,
        bool isDraft = true,
        bool isFeatured = false,
        int vectorId = 0) : base(id)
    {
        ValidateTitle(title);
        ValidateDescription(description);
        ValidateLink(link);
        ValidateUrl(githubUrl, nameof(githubUrl));
        ValidateUrl(liveUrl, nameof(liveUrl));
        ValidateUrl(imageUrl, nameof(imageUrl));

        Title = title;
        Description = description;
        Link = link;
        GithubUrl = githubUrl;
        LiveUrl = liveUrl;
        ImageUrl = imageUrl;
        IsDraft = isDraft;
        IsFeatured = isFeatured;
        VectorId = vectorId;
        _technologies = new List<string>();
    }

    /// <summary>
    /// Updates the title of the project.
    /// </summary>
    /// <param name="title">The new title of the project.</param>
    public void UpdateTitle(string title)
    {
        ValidateTitle(title);
        Title = title;
        UpdateModifiedDate();
    }

    /// <summary>
    /// Updates the description of the project.
    /// </summary>
    /// <param name="description">The new description of the project.</param>
    public void UpdateDescription(string description)
    {
        ValidateDescription(description);
        Description = description;
        UpdateModifiedDate();
    }

    /// <summary>
    /// Updates the link of the project.
    /// </summary>
    /// <param name="link">The new link of the project.</param>
    public void UpdateLink(string link)
    {
        ValidateLink(link);
        Link = link;
        UpdateModifiedDate();
    }

    /// <summary>
    /// Updates the GitHub URL of the project.
    /// </summary>
    /// <param name="githubUrl">The new GitHub URL of the project.</param>
    public void UpdateGithubUrl(string? githubUrl)
    {
        ValidateUrl(githubUrl, nameof(githubUrl));
        GithubUrl = githubUrl;
        UpdateModifiedDate();
    }

    /// <summary>
    /// Updates the live URL of the project.
    /// </summary>
    /// <param name="liveUrl">The new live URL of the project.</param>
    public void UpdateLiveUrl(string? liveUrl)
    {
        ValidateUrl(liveUrl, nameof(liveUrl));
        LiveUrl = liveUrl;
        UpdateModifiedDate();
    }

    /// <summary>
    /// Updates the image URL of the project.
    /// </summary>
    /// <param name="imageUrl">The new image URL of the project.</param>
    public void UpdateImageUrl(string? imageUrl)
    {
        ValidateUrl(imageUrl, nameof(imageUrl));
        ImageUrl = imageUrl;
        UpdateModifiedDate();
    }

    /// <summary>
    /// Publishes the project.
    /// </summary>
    public void Publish()
    {
        IsDraft = false;
        UpdateModifiedDate();
    }

    /// <summary>
    /// Unpublishes the project.
    /// </summary>
    public void UnPublish()
    {
        IsDraft = true;
        UpdateModifiedDate();
    }

    /// <summary>
    /// Features the project.
    /// </summary>
    public void Feature()
    {
        IsFeatured = true;
        UpdateModifiedDate();
    }

    /// <summary>
    /// Unfeatures the project.
    /// </summary>
    public void UnFeature()
    {
        IsFeatured = false;
        UpdateModifiedDate();
    }

    /// <summary>
    /// Adds a technology to the project.
    /// </summary>
    /// <param name="technology">The technology to add.</param>
    public void AddTechnology(string technology)
    {
        if (string.IsNullOrWhiteSpace(technology))
            throw new DomainValidationException("Technology cannot be empty");

        var normalizedTechnology = technology.Trim().ToLowerInvariant();
        if (!_technologies.Contains(normalizedTechnology))
        {
            _technologies.Add(normalizedTechnology);
            UpdateModifiedDate();
        }
    }

    /// <summary>
    /// Removes a technology from the project.
    /// </summary>
    /// <param name="technology">The technology to remove.</param>
    public void RemoveTechnology(string technology)
    {
        var normalizedTechnology = technology.Trim().ToLowerInvariant();
        if (_technologies.Remove(normalizedTechnology))
        {
            UpdateModifiedDate();
        }
    }

    /// <summary>
    /// Clears all technologies from the project.
    /// </summary>
    public void ClearTechnologies()
    {
        if (_technologies.Any())
        {
            _technologies.Clear();
            UpdateModifiedDate();
        }
    }

    /// <summary>
    /// Validates the title of the project.
    /// </summary>
    /// <param name="title">The title to validate.</param>
    private static void ValidateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainValidationException("Title cannot be empty");
        
        if (title.Length > 200)
            throw new DomainValidationException("Title cannot be longer than 200 characters");
    }

    /// <summary>
    /// Validates the description of the project.
    /// </summary>
    /// <param name="description">The description to validate.</param>
    private static void ValidateDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new DomainValidationException("Description cannot be empty");
        
        if (description.Length > 2000)
            throw new DomainValidationException("Description cannot be longer than 2000 characters");
    }

    /// <summary>
    /// Validates the link of the project.
    /// </summary>
    /// <param name="link">The link to validate.</param>
    private static void ValidateLink(string link)
    {
        if (string.IsNullOrWhiteSpace(link))
            throw new DomainValidationException("Link cannot be empty");

        if (link.Length > 200)
            throw new DomainValidationException("Link cannot be longer than 200 characters");
    }

    /// <summary>
    /// Validates a URL.
    /// </summary>
    /// <param name="url">The URL to validate.</param>
    /// <param name="paramName">The name of the parameter.</param>
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
