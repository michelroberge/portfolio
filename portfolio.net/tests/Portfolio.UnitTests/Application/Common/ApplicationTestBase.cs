using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Portfolio.Application.Common.Mappings;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Application.Interfaces.Services;

namespace Portfolio.UnitTests.Application.Common;

/// <summary>
/// Base class for Application layer tests following Clean Architecture principles.
/// Provides common test infrastructure including mocked repositories and services.
/// </summary>
public abstract class ApplicationTestBase
{
    protected readonly IServiceProvider ServiceProvider;
    protected readonly Mock<IBlogRepository> MockBlogRepository;
    protected readonly Mock<IProjectRepository> MockProjectRepository;
    protected readonly Mock<IUserRepository> MockUserRepository;
    protected readonly Mock<IUnitOfWork> MockUnitOfWork;
    protected readonly Mock<ICurrentUserService> MockCurrentUserService;
    protected readonly IMapper Mapper;

    protected ApplicationTestBase()
    {
        // Initialize mocks following Clean Architecture's dependency inversion principle
        MockBlogRepository = new Mock<IBlogRepository>();
        MockProjectRepository = new Mock<IProjectRepository>();
        MockUserRepository = new Mock<IUserRepository>();
        MockUnitOfWork = new Mock<IUnitOfWork>();
        MockCurrentUserService = new Mock<ICurrentUserService>();

        var services = new ServiceCollection();

        // Configure AutoMapper with domain mapping profile
        services.AddAutoMapper(cfg =>
        {
            cfg.AddProfile<MappingProfile>();
        });

        // Add logging for test diagnostics
        services.AddLogging(cfg => cfg.AddDebug());

        // Configure repository relationships in UnitOfWork
        MockUnitOfWork.SetupGet(x => x.Blogs).Returns(MockBlogRepository.Object);
        MockUnitOfWork.SetupGet(x => x.Projects).Returns(MockProjectRepository.Object);
        MockUnitOfWork.SetupGet(x => x.Users).Returns(MockUserRepository.Object);

        // Register mocked services following dependency inversion
        services.AddSingleton(MockBlogRepository.Object);
        services.AddSingleton(MockProjectRepository.Object);
        services.AddSingleton(MockUserRepository.Object);
        services.AddSingleton(MockUnitOfWork.Object);
        services.AddSingleton(MockCurrentUserService.Object);

        ServiceProvider = services.BuildServiceProvider();
        Mapper = ServiceProvider.GetRequiredService<IMapper>();
    }

    protected void SetupCurrentUser(string userId, string username, bool isAdmin = false)
    {
        MockCurrentUserService.Setup(x => x.UserId).Returns(userId);
        MockCurrentUserService.Setup(x => x.Username).Returns(username);
        MockCurrentUserService.Setup(x => x.IsAdmin).Returns(isAdmin);
    }

    protected void VerifyUnitOfWorkSaveChanges(Times times)
    {
        MockUnitOfWork.Verify(x => x.SaveChangesAsync(default), times);
    }

    protected void VerifyUnitOfWorkTransaction(Times times)
    {
        MockUnitOfWork.Verify(x => x.BeginTransactionAsync(default), times);
        MockUnitOfWork.Verify(x => x.CommitTransactionAsync(default), times);
    }
}
