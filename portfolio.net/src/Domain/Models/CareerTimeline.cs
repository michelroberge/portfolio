namespace Domain.Models;

public class CareerTimeline
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Company { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Description { get; set; }
    public string Location { get; set; }
    public List<string> Skills { get; set; } = new();
    public int Order { get; set; }
    public bool IsDraft { get; set; }
}
