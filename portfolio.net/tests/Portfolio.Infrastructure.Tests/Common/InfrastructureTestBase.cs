using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Infrastructure.Persistence;
using Portfolio.Infrastructure.Persistence.Repositories;

namespace Portfolio.Infrastructure.Tests.Common;

public class InfrastructureTestBase : IDisposable
{
    protected readonly ApplicationDbContext Context;
    protected readonly IBlogRepository BlogRepository;
    protected readonly IProjectRepository ProjectRepository;
    protected readonly IUserRepository UserRepository;
    protected readonly IUnitOfWork UnitOfWork;

    protected InfrastructureTestBase()
    {
        var services = new ServiceCollection();

        // Create a new unique database name for each test run
        var dbName = $"Portfolio_Test_{Guid.NewGuid()}";

        // Configure DbContext to use in-memory database
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseInMemoryDatabase(dbName));

        // Add repositories
        services.AddScoped<IBlogRepository, BlogRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        var serviceProvider = services.BuildServiceProvider();

        Context = serviceProvider.GetRequiredService<ApplicationDbContext>();
        BlogRepository = serviceProvider.GetRequiredService<IBlogRepository>();
        ProjectRepository = serviceProvider.GetRequiredService<IProjectRepository>();
        UserRepository = serviceProvider.GetRequiredService<IUserRepository>();
        UnitOfWork = serviceProvider.GetRequiredService<IUnitOfWork>();
    }

    public void Dispose()
    {
        Context.Database.EnsureDeleted();
        Context.Dispose();
    }
}
