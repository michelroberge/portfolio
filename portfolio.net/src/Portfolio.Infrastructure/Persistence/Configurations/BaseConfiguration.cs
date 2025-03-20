using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Domain.Common;

namespace Portfolio.Infrastructure.Persistence.Configurations;

/// <summary>
/// Base configuration for all entities following Clean Architecture principles.
/// Provides common configuration for entity properties.
/// </summary>
public abstract class BaseConfiguration<TEntity> : IEntityTypeConfiguration<TEntity>
    where TEntity : Entity
{
    public virtual void Configure(EntityTypeBuilder<TEntity> builder)
    {
        // Configure key
        builder.HasKey(e => e.Id);

        // Configure common properties
        builder.Property(e => e.Id)
            .HasMaxLength(36)
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .IsRequired();

        builder.Property(e => e.UpdatedAt)
            .IsRequired();

        // Allow derived configurations to add additional configuration
        ConfigureEntity(builder);
    }

    /// <summary>
    /// Configure additional entity-specific properties.
    /// Override this method in derived configurations to add entity-specific configuration.
    /// </summary>
    protected virtual void ConfigureEntity(EntityTypeBuilder<TEntity> builder)
    {
    }
}
