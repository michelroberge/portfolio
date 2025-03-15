using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Persistence.Configurations;

public class BlogConfiguration : BaseConfiguration<Blog>
{
    public override void Configure(EntityTypeBuilder<Blog> builder)
    {
        base.Configure(builder);

        builder.ToTable("Blogs");

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

        builder.Property(b => b.IsDraft)
            .IsRequired();

        builder.Property(b => b.PublishAt);

        builder.Property(b => b.VectorId)
            .IsRequired();

        // Create unique index for Link
        builder.HasIndex(b => b.Link)
            .IsUnique();

        // Create index for PublishAt to optimize queries for published blogs
        builder.HasIndex(b => b.PublishAt);

        // Create index for VectorId to optimize vector search operations
        builder.HasIndex(b => b.VectorId)
            .IsUnique();
    }
}
