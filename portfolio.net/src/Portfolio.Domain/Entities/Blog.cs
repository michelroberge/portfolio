using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.ValueObjects;
using System.Text.RegularExpressions;

namespace Portfolio.Domain.Entities;

public class Blog : PublishableEntity
{
    private string _title = string.Empty;
    private Slug? _slug;
    public string Title 
    { 
        get => _title;
        private init
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainValidationException("Title cannot be empty");
            if (value.Length > 200)
                throw new DomainValidationException("Title cannot be longer than 200 characters");
            _title = value;
            _slug = Slug.Create(value);
        }
    }

    public Slug? Slug{ get =>_slug; }
    public string Excerpt { get; private init; } = string.Empty;
    public string Body { get; private init; } = string.Empty;
    public DateTime? PublishAt { get; private init; }
    public string Link { get; private init; } = string.Empty;
    public List<string> Tags { get; private init; } = new();

    private Blog() { } // For EF Core

    public Blog(
        string title,
        string excerpt,
        string body,
        DateTime? publishAt = null,
        List<string>? tags = null)
    {
        Title = title;
        Excerpt = excerpt;
        Body = body;
        PublishAt = publishAt;
        Link = GenerateLink(title);
        Tags = tags ?? new List<string>();
        ValidateProperties();
    }

    public Blog Update(
        string title,
        string excerpt,
        string body,
        DateTime? publishAt = null,
        List<string>? tags = null,
        bool? isDraft = null,
        bool? isPublished = null)
    {
        ValidateProperties(title, excerpt, body);

        return new Blog
        {
            Id = Id,
            Title = title,
            Excerpt = excerpt,
            Body = body,
            PublishAt = publishAt ?? PublishAt,
            Link = title != Title ? GenerateLink(title) : Link,
            Tags = tags ?? Tags,
            IsDraft = isDraft ?? IsDraft,
            IsPublished = isPublished ?? IsPublished,
            VectorId = VectorId,
            CreatedAt = CreatedAt,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public Blog Publish()
    {
        ValidateForPublishing();

        return new Blog
        {
            Id = Id,
            Title = Title,
            Excerpt = Excerpt,
            Body = Body,
            PublishAt = DateTime.UtcNow,
            Link = Link,
            Tags = Tags,
            IsDraft = false,
            IsPublished = true,
            VectorId = VectorId,
            CreatedAt = CreatedAt,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public Blog Unpublish()
    {
        return new Blog
        {
            Id = Id,
            Title = Title,
            Excerpt = Excerpt,
            Body = Body,
            PublishAt = null,
            Link = Link,
            Tags = Tags,
            IsDraft = true,
            IsPublished = false,
            VectorId = VectorId,
            CreatedAt = CreatedAt,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public Blog SetVectorId(int vectorId)
    {
        ValidateVectorId(vectorId);

        return new Blog
        {
            Id = Id,
            Title = Title,
            Excerpt = Excerpt,
            Body = Body,
            PublishAt = PublishAt,
            Link = Link,
            Tags = Tags,
            IsDraft = IsDraft,
            IsPublished = IsPublished,
            VectorId = vectorId,
            CreatedAt = CreatedAt,
            UpdatedAt = DateTime.UtcNow
        };
    }

    protected override void ValidateForPublishing()
    {
        if (string.IsNullOrWhiteSpace(Excerpt))
            throw new DomainValidationException("Excerpt is required before publishing");
        if (string.IsNullOrWhiteSpace(Body))
            throw new DomainValidationException("Body is required before publishing");
    }

    private void ValidateProperties()
    {
        ValidateProperties(Title, Excerpt, Body);
    }

    private static void ValidateProperties(string title, string excerpt, string body)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainValidationException("Title cannot be empty");
        if (title.Length > 200)
            throw new DomainValidationException("Title cannot be longer than 200 characters");
        if (excerpt?.Length > 500)
            throw new DomainValidationException("Excerpt cannot be longer than 500 characters");
    }

    private static string GenerateLink(string title)
    {
        var slug = title.ToLowerInvariant();
        // Replace any non-alphanumeric characters with a dash
        slug = Regex.Replace(slug, @"[^a-z0-9]", "-");
        // Remove multiple consecutive dashes
        slug = Regex.Replace(slug, @"-+", "-");
        // Remove leading and trailing dashes
        slug = slug.Trim('-');
        return slug;
    }
}
