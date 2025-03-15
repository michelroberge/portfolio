using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Persistence.Configurations;

public class ProjectConfiguration : BaseConfiguration<Project>
{
    public override void Configure(EntityTypeBuilder<Project> builder)
    {
        base.Configure(builder);

        builder.ToTable("Projects");

        builder.Property(p => p.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(p => p.Link)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(p => p.Description)
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(p => p.GithubUrl)
            .HasMaxLength(500);

        builder.Property(p => p.LiveUrl)
            .HasMaxLength(500);

        builder.Property(p => p.ImageUrl)
            .HasMaxLength(500);

        builder.Property(p => p.IsFeatured)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(p => p.VectorId)
            .IsRequired();

        // Create unique index for Link
        builder.HasIndex(p => p.Link)
            .IsUnique();

        // Create index for IsFeatured to optimize queries for featured projects
        builder.HasIndex(p => p.IsFeatured);

        // Create index for VectorId to optimize vector search operations
        builder.HasIndex(p => p.VectorId)
            .IsUnique();
    }
}
