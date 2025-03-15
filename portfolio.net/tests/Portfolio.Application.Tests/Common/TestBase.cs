using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Portfolio.Application.Common.Mappings;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Application.Interfaces.Services;

namespace Portfolio.Application.Tests.Common;

public class TestBase
{
    protected readonly IServiceProvider ServiceProvider;
    protected readonly Mock<IBlogRepository> MockBlogRepository;
    protected readonly Mock<IProjectRepository> MockProjectRepository;
    protected readonly Mock<IUserRepository> MockUserRepository;
    protected readonly Mock<IUnitOfWork> MockUnitOfWork;
    protected readonly Mock<ICurrentUserService> MockCurrentUserService;
    protected readonly IMapper Mapper;

    protected TestBase()
    {
        MockBlogRepository = new Mock<IBlogRepository>();
        MockProjectRepository = new Mock<IProjectRepository>();
        MockUserRepository = new Mock<IUserRepository>();
        MockUnitOfWork = new Mock<IUnitOfWork>();
        MockCurrentUserService = new Mock<ICurrentUserService>();

        var services = new ServiceCollection();

        // Configure AutoMapper
        services.AddAutoMapper(cfg =>
        {
            cfg.AddProfile<MappingProfile>();
        });

        // Add logging
        services.AddLogging(cfg => cfg.AddDebug());

        // Configure mocks
        MockUnitOfWork.SetupGet(x => x.Blogs).Returns(MockBlogRepository.Object);
        MockUnitOfWork.SetupGet(x => x.Projects).Returns(MockProjectRepository.Object);
        MockUnitOfWork.SetupGet(x => x.Users).Returns(MockUserRepository.Object);

        // Add mocked services
        services.AddSingleton(MockBlogRepository.Object);
        services.AddSingleton(MockProjectRepository.Object);
        services.AddSingleton(MockUserRepository.Object);
        services.AddSingleton(MockUnitOfWork.Object);
        services.AddSingleton(MockCurrentUserService.Object);

        ServiceProvider = services.BuildServiceProvider();
        Mapper = ServiceProvider.GetRequiredService<IMapper>();
    }
}
