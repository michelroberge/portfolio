namespace Domain.Models;

public class Blog
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Excerpt { get; set; }
    public string Body { get; set; }
    public bool IsDraft { get; set; }
    public DateTime PublishAt { get; set; }
}
