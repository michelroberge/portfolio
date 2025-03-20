using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Domain.Entities;
using Portfolio.Domain.ValueObjects;

namespace Portfolio.Infrastructure.Persistence.Configurations;

/// <summary>
/// Configuration for User entity following Clean Architecture and DDD principles.
/// Handles database mapping for User aggregate root and its value objects.
/// </summary>
public class UserConfiguration : BaseConfiguration<User>
{
    protected override void ConfigureEntity(EntityTypeBuilder<User> builder)
    {
        // Configure table
        builder.ToTable("Users");

        // Configure required properties
        builder.Property(u => u.Username)
            .HasMaxLength(50)
            .IsRequired();

        // Configure Email value object
        builder.Property(u => u.Email)
            .HasConversion(
                email => email.Value,
                value => Email.Create(value))
            .HasMaxLength(256)
            .IsRequired();

        // Configure optional properties
        builder.Property(u => u.DisplayName)
            .HasMaxLength(100);

        builder.Property(u => u.AvatarUrl)
            .HasMaxLength(500);

        // Configure authentication properties
        builder.Property(u => u.IsAdmin)
            .IsRequired()
            .HasDefaultValue(false);

        // Configure indexes for performance and data integrity
        builder.HasIndex(u => u.Username)
            .IsUnique()
            .HasDatabaseName("IX_Users_Username");

        builder.HasIndex(u => u.Email)
            .IsUnique()
            .HasDatabaseName("IX_Users_Email");

        builder.HasIndex(u => u.IsAdmin)
            .HasDatabaseName("IX_Users_IsAdmin");
    }
}
