using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Domain.Entities;
using System.Text.Json;

namespace Portfolio.Infrastructure.Persistence.Configurations;

/// <summary>
/// Configuration for Blog entity following Clean Architecture and DDD principles.
/// Handles database mapping for Blog aggregate root and its value objects.
/// </summary>
public class BlogConfiguration : BaseConfiguration<Blog>
{
    protected override void ConfigureEntity(EntityTypeBuilder<Blog> builder)
    {
        // Configure table
        builder.ToTable("Blogs");

        // Configure required properties
        builder.Property(b => b.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(b => b.Link)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(b => b.Excerpt)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(b => b.Body)
            .IsRequired();

        // Configure status properties
        builder.Property(b => b.IsDraft)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(b => b.IsPublished)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(b => b.PublishAt);

        // Configure vector search properties
        builder.Property(b => b.VectorId)
            .IsRequired();

        // Configure tags collection
        builder.Property(b => b.Tags)
            .HasColumnName("Tags")
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null!),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null!)!);

        // Configure indexes for performance and data integrity
        builder.HasIndex(b => b.Link)
            .IsUnique()
            .HasDatabaseName("IX_Blogs_Link");

        builder.HasIndex(b => b.VectorId)
            .IsUnique()
            .HasDatabaseName("IX_Blogs_VectorId");

        // Configure composite indexes for efficient querying
        builder.HasIndex(b => new { b.IsDraft, b.IsPublished, b.PublishAt })
            .HasDatabaseName("IX_Blogs_IsDraft_IsPublished_PublishAt");

        // Configure full-text search index
        builder.HasIndex(b => new { b.Title, b.Body })
            .HasDatabaseName("IX_Blogs_FullText");
    }
}
