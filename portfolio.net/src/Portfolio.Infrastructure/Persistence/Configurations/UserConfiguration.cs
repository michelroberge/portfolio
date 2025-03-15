using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Persistence.Configurations;

public class UserConfiguration : BaseConfiguration<User>
{
    public override void Configure(EntityTypeBuilder<User> builder)
    {
        base.Configure(builder);

        builder.ToTable("Users");

        builder.Property(u => u.Username)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(u => u.Email)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(u => u.DisplayName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(u => u.AvatarUrl)
            .HasMaxLength(500);

        builder.Property(u => u.Provider)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(u => u.ProviderId)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(u => u.IsAdmin)
            .IsRequired()
            .HasDefaultValue(false);

        // Create unique indexes
        builder.HasIndex(u => u.Username)
            .IsUnique();

        builder.HasIndex(u => u.Email)
            .IsUnique();

        // Create composite index for Provider and ProviderId
        builder.HasIndex(u => new { u.Provider, u.ProviderId })
            .IsUnique();

        // Create index for IsAdmin to optimize queries for admin users
        builder.HasIndex(u => u.IsAdmin);
    }
}
