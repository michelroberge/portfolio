namespace Portfolio.Domain.Interfaces;

/// <summary>
/// Represents a project in the domain
/// </summary>
public interface IProject : IEntity
{
    string Title { get; }
    string Description { get; }
    string? GithubUrl { get; }
    string? LiveUrl { get; }
    string? ImageUrl { get; }
    int VectorId { get; }
    string? Link { get; }
    IReadOnlyCollection<string> Technologies { get; }
    
    void UpdateTitle(string title);
    void UpdateDescription(string description);
    void UpdateGithubUrl(string? githubUrl);
    void UpdateLiveUrl(string? liveUrl);
    void UpdateImageUrl(string? imageUrl);
    void AddTechnology(string technology);
    void RemoveTechnology(string technology);
    void ClearTechnologies();
}
