namespace Portfolio.Domain.Interfaces;

/// <summary>
/// Represents a blog entry in the domain
/// </summary>
public interface IBlog : IEntity
{
    string Title { get; }
    string Excerpt { get; }
    string Body { get; }
    bool IsDraft { get; }
    DateTime? PublishAt { get; }
    int VectorId { get; }
    string? Link { get; }
    IReadOnlyCollection<string> Tags { get; }
    
    void UpdateTitle(string title);
    void UpdateExcerpt(string excerpt);
    void UpdateBody(string body);
    void UpdateDraftStatus(bool isDraft);
    void UpdatePublishDate(DateTime? publishAt);
    void AddTag(string tag);
    void RemoveTag(string tag);
    void ClearTags();
}
