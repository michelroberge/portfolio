using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Infrastructure.Persistence;
using Portfolio.Infrastructure.Persistence.Repositories;
using Portfolio.UnitTests.Common;

namespace Portfolio.UnitTests.Infrastructure.Persistence;

/// <summary>
/// Test base class for repository tests following Clean Architecture principles.
/// Provides configured repositories and unit of work for testing.
/// </summary>
public class TestDbContext : TestBase
{
    protected readonly IBlogRepository BlogRepository;
    protected readonly IProjectRepository ProjectRepository;
    protected readonly IUserRepository UserRepository;
    protected readonly IUnitOfWork UnitOfWork;

    protected TestDbContext()
    {
        BlogRepository = ServiceProvider.GetRequiredService<IBlogRepository>();
        ProjectRepository = ServiceProvider.GetRequiredService<IProjectRepository>();
        UserRepository = ServiceProvider.GetRequiredService<IUserRepository>();
        UnitOfWork = ServiceProvider.GetRequiredService<IUnitOfWork>();
    }

    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        // Register repositories and unit of work
        services.AddScoped<IBlogRepository, BlogRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
    }
}
