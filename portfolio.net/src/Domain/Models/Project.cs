namespace Domain.Models;

public class Project
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Excerpt { get; set; }
    public string Description { get; set; }
    public bool IsDraft { get; set; }
    public DateTime PublishAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<string> Tags { get; set; } = new();
    public string Slug { get; set; }
}
