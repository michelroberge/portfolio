using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Domain.Entities;
using System.Text.Json;

namespace Portfolio.Infrastructure.Persistence.Configurations;

/// <summary>
/// Configuration for Page entity following Clean Architecture and DDD principles.
/// Handles database mapping for Page aggregate root and its value objects.
/// </summary>
public class PageConfiguration : BaseConfiguration<Page>
{
    protected override void ConfigureEntity(EntityTypeBuilder<Page> builder)
    {
        // Configure table
        builder.ToTable("Pages");

        // Configure required properties
        builder.Property(p => p.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(p => p.Slug)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(p => p.Content)
            .IsRequired();

        // Configure metadata properties
        builder.Property(p => p.MetaDescription)
            .HasMaxLength(500);

        builder.Property(p => p.MetaKeywords)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null!),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null!)!);

        builder.Property(p => p.OpenGraphImage)
            .HasMaxLength(500);

        // Configure status properties
        builder.Property(p => p.IsDraft)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.IsPublished)
            .IsRequired()
            .HasDefaultValue(false);

        // Configure vector search properties
        builder.Property(p => p.VectorId)
            .IsRequired();

        // Configure indexes for performance and data integrity
        builder.HasIndex(p => p.Slug)
            .IsUnique()
            .HasDatabaseName("IX_Pages_Slug");

        builder.HasIndex(p => p.VectorId)
            .IsUnique()
            .HasDatabaseName("IX_Pages_VectorId");

        // Configure composite indexes for efficient querying
        builder.HasIndex(p => new { p.IsDraft, p.IsPublished })
            .HasDatabaseName("IX_Pages_IsDraft_IsPublished");

        // Configure full-text search index
        builder.HasIndex(p => new { p.Title, p.Content })
            .HasDatabaseName("IX_Pages_FullText");
    }
}
