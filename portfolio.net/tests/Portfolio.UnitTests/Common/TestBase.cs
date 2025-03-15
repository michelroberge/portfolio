using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Portfolio.Application.Interfaces.Services;
using Portfolio.Infrastructure.Persistence;

namespace Portfolio.UnitTests.Common;

public abstract class TestBase : IDisposable
{
    protected readonly ApplicationDbContext Context;
    protected readonly IServiceProvider ServiceProvider;
    protected readonly Mock<ICurrentUserService> CurrentUserServiceMock;

    protected TestBase()
    {
        var services = new ServiceCollection();

        // Create a new unique database name for each test run
        var dbName = $"Portfolio_Test_{Guid.NewGuid()}";

        // Configure DbContext to use in-memory database
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseInMemoryDatabase(dbName));

        // Setup mock services
        CurrentUserServiceMock = new Mock<ICurrentUserService>();
        CurrentUserServiceMock.Setup(x => x.UserId).Returns("test-user-id");
        CurrentUserServiceMock.Setup(x => x.UserName).Returns("test-user");
        CurrentUserServiceMock.Setup(x => x.IsAuthenticated).Returns(true);
        CurrentUserServiceMock.Setup(x => x.IsAdmin).Returns(true);
        CurrentUserServiceMock.Setup(x => x.Roles).Returns(new List<string> { "Admin" });

        services.AddScoped(_ => CurrentUserServiceMock.Object);

        // Add logging
        services.AddLogging(builder => builder.AddDebug());

        // Add other services as needed
        ConfigureServices(services);

        ServiceProvider = services.BuildServiceProvider();
        Context = ServiceProvider.GetRequiredService<ApplicationDbContext>();
    }

    protected virtual void ConfigureServices(IServiceCollection services)
    {
        // Override in derived classes to add additional services
    }

    public void Dispose()
    {
        Context.Database.EnsureDeleted();
        Context.Dispose();
    }
}
