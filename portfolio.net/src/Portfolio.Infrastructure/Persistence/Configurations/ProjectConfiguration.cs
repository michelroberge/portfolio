using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Domain.Entities;
using System.Text.Json;

namespace Portfolio.Infrastructure.Persistence.Configurations;

/// <summary>
/// Configuration for Project entity following Clean Architecture and DDD principles.
/// Handles database mapping for Project aggregate root and its value objects.
/// </summary>
public class ProjectConfiguration : BaseConfiguration<Project>
{
    protected override void ConfigureEntity(EntityTypeBuilder<Project> builder)
    {
        // Configure table
        builder.ToTable("Projects");

        // Configure required properties
        builder.Property(p => p.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(p => p.Link)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(p => p.Description)
            .IsRequired();

        // Configure optional URLs
        builder.Property(p => p.GithubUrl)
            .HasMaxLength(500);

        builder.Property(p => p.LiveUrl)
            .HasMaxLength(500);

        builder.Property(p => p.ImageUrl)
            .HasMaxLength(500);

        // Configure status properties
        builder.Property(p => p.IsDraft)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.IsFeatured)
            .IsRequired()
            .HasDefaultValue(false);

        // Configure vector search properties
        builder.Property(p => p.VectorId)
            .IsRequired();

        // Configure technologies collection
        builder.Property(p => p.Technologies)
            .HasColumnName("Technologies")
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null));

        // Configure indexes for performance and data integrity
        builder.HasIndex(p => p.Link)
            .IsUnique()
            .HasDatabaseName("IX_Projects_Link");

        builder.HasIndex(p => p.VectorId)
            .IsUnique()
            .HasDatabaseName("IX_Projects_VectorId");

        // Configure composite indexes for efficient querying
        builder.HasIndex(p => new { p.IsDraft, p.IsFeatured })
            .HasDatabaseName("IX_Projects_IsDraft_IsFeatured");
    }
}
