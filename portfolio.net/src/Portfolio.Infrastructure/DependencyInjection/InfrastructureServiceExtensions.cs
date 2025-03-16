using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Infrastructure.Persistence;
using Portfolio.Infrastructure.Persistence.Repositories;

namespace Portfolio.Infrastructure;

public static class InfrastructureServiceExtensions
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Register DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        // Register repositories following Clean Architecture
        services.AddScoped<IBlogRepository, BlogRepository>();
        services.AddScoped<IPageRepository, PageRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        // Register UnitOfWork
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
