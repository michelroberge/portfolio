using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;

namespace Portfolio.Domain.Entities;

public class Page : Entity
{
    public string Title { get; private init; } = null!;
    public string Slug { get; private init; } = null!;
    public string Content { get; private init; } = null!;

    private Page() { } // For EF Core

    public Page(string title, string slug, string content)
    {
        Title = title;
        Slug = slug.ToLower().Replace(" ", "-");
        Content = content;
        ValidateProperties();
    }

    public Page Update(string title, string slug, string content)
    {
        ValidateTitle(title);
        ValidateSlug(slug);
        ValidateContent(content);

        return new Page
        {
            Id = Id,
            Title = title,
            Slug = slug.ToLower().Replace(" ", "-"),
            Content = content,
            CreatedAt = CreatedAt,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private void ValidateProperties()
    {
        ValidateTitle(Title);
        ValidateSlug(Slug);
        ValidateContent(Content);
    }

    private static void ValidateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainValidationException("Title cannot be empty");
        if (title.Length > 200)
            throw new DomainValidationException("Title cannot exceed 200 characters");
    }

    private static void ValidateSlug(string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
            throw new DomainValidationException("Slug cannot be empty");
        if (slug.Length > 200)
            throw new DomainValidationException("Slug cannot exceed 200 characters");
    }

    private static void ValidateContent(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new DomainValidationException("Content cannot be empty");
    }
}