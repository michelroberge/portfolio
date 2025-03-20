using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;

namespace Portfolio.Domain.Entities;

public class Page : PublishableEntity
{
    public string Title { get; private init; } = null!;
    public string Slug { get; private init; } = null!;
    public string Content { get; private init; } = null!;
    public string? MetaDescription { get; private init; }
    public List<string> MetaKeywords { get; private init; } = new();
    public string? OpenGraphImage { get; private init; }

    private Page() { } // For EF Core

    public Page(string title, string slug, string content, string? metaDescription = null, List<string>? metaKeywords = null, string? openGraphImage = null)
    {
        Title = title;
        Slug = slug.ToLower().Replace(" ", "-");
        Content = content;
        MetaDescription = metaDescription;
        MetaKeywords = metaKeywords ?? new List<string>();
        OpenGraphImage = openGraphImage;
        ValidateProperties();
    }

    public Page Update(
        string title, 
        string slug, 
        string content, 
        string? metaDescription = null,
        List<string>? metaKeywords = null,
        string? openGraphImage = null,
        bool? isDraft = null,
        bool? isPublished = null)
    {
        ValidateTitle(title);
        ValidateSlug(slug);
        ValidateContent(content);
        ValidateMetadata(metaDescription, metaKeywords, openGraphImage);

        return new Page
        {
            Id = Id,
            Title = title,
            Slug = slug.ToLower().Replace(" ", "-"),
            Content = content,
            MetaDescription = metaDescription ?? MetaDescription,
            MetaKeywords = metaKeywords ?? MetaKeywords,
            OpenGraphImage = openGraphImage ?? OpenGraphImage,
            IsDraft = isDraft ?? IsDraft,
            IsPublished = isPublished ?? IsPublished,
            VectorId = VectorId,
            CreatedAt = CreatedAt,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public Page Publish()
    {
        ValidateForPublishing();

        return new Page
        {
            Id = Id,
            Title = Title,
            Slug = Slug,
            Content = Content,
            MetaDescription = MetaDescription,
            MetaKeywords = MetaKeywords,
            OpenGraphImage = OpenGraphImage,
            IsDraft = false,
            IsPublished = true,
            VectorId = VectorId,
            CreatedAt = CreatedAt,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public Page Unpublish()
    {
        return new Page
        {
            Id = Id,
            Title = Title,
            Slug = Slug,
            Content = Content,
            MetaDescription = MetaDescription,
            MetaKeywords = MetaKeywords,
            OpenGraphImage = OpenGraphImage,
            IsDraft = true,
            IsPublished = false,
            VectorId = VectorId,
            CreatedAt = CreatedAt,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public Page SetVectorId(int vectorId)
    {
        ValidateVectorId(vectorId);

        return new Page
        {
            Id = Id,
            Title = Title,
            Slug = Slug,
            Content = Content,
            MetaDescription = MetaDescription,
            MetaKeywords = MetaKeywords,
            OpenGraphImage = OpenGraphImage,
            IsDraft = IsDraft,
            IsPublished = IsPublished,
            VectorId = vectorId,
            CreatedAt = CreatedAt,
            UpdatedAt = DateTime.UtcNow
        };
    }

    protected override void ValidateForPublishing()
    {
        if (string.IsNullOrEmpty(MetaDescription))
            throw new DomainValidationException("Meta description is required before publishing");
    }

    private void ValidateProperties()
    {
        ValidateTitle(Title);
        ValidateSlug(Slug);
        ValidateContent(Content);
        ValidateMetadata(MetaDescription, MetaKeywords, OpenGraphImage);
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

    private static void ValidateMetadata(string? metaDescription, List<string>? metaKeywords, string? openGraphImage)
    {
        if (metaDescription?.Length > 500)
            throw new DomainValidationException("Meta description cannot exceed 500 characters");

        if (openGraphImage?.Length > 500)
            throw new DomainValidationException("Open Graph image URL cannot exceed 500 characters");
    }
}