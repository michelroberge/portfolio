using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

 public class Page(string title = "", string slug = "", string content = "") : Entity
    {
    public string Title { get; private set; } = title;
    public string Slug { get; private set; } = slug.ToLower().Replace(" ", "-");
    public string Content { get; private set; } = content;
}