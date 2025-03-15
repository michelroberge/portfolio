using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Tests.Common;
using Portfolio.Application.UseCases.Projects.Queries.GetProjectByLink;
using Portfolio.Domain.Entities;
using Xunit;

namespace Portfolio.Application.Tests.UseCases.Projects.Queries;

public class GetProjectByLinkQueryTests : TestBase
{
    private readonly GetProjectByLinkQueryHandler _handler;

    public GetProjectByLinkQueryTests()
    {
        _handler = new GetProjectByLinkQueryHandler(
            MockProjectRepository.Object,
            Mapper,
            ServiceProvider.GetService<Microsoft.Extensions.Logging.ILogger<GetProjectByLinkQueryHandler>>()!);
    }

    [Fact]
    public async Task Handle_ExistingProject_ShouldReturnProjectDto()
    {
        // Arrange
        var link = "test-project";
        var project = new Project(
            id: "test-id",
            title: "Test Project",
            description: "Test Description",
            githubUrl: "https://github.com/test/project",
            liveUrl: "https://test-project.com",
            imageUrl: "https://test-project.com/image.jpg",
            vectorId: 1
        );

        project.AddTechnology("C#");
        project.AddTechnology(".NET");

        MockProjectRepository
            .Setup(x => x.GetByLinkAsync(link, It.IsAny<CancellationToken>()))
            .ReturnsAsync(project);

        var query = new GetProjectByLinkQuery { Link = link };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<ProjectDto>();
        result!.Title.Should().Be(project.Title);
        result.Description.Should().Be(project.Description);
        result.GithubUrl.Should().Be(project.GithubUrl);
        result.LiveUrl.Should().Be(project.LiveUrl);
        result.ImageUrl.Should().Be(project.ImageUrl);
        result.Technologies.Should().BeEquivalentTo(project.Technologies);

        MockProjectRepository.Verify(
            x => x.GetByLinkAsync(link, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_NonExistingProject_ShouldReturnNull()
    {
        // Arrange
        var link = "non-existing-project";

        MockProjectRepository
            .Setup(x => x.GetByLinkAsync(link, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Project?)null);

        var query = new GetProjectByLinkQuery { Link = link };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().BeNull();

        MockProjectRepository.Verify(
            x => x.GetByLinkAsync(link, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_RepositoryThrowsException_ShouldPropagateException()
    {
        // Arrange
        var link = "test-project";
        var expectedException = new Exception("Test exception");

        MockProjectRepository
            .Setup(x => x.GetByLinkAsync(link, It.IsAny<CancellationToken>()))
            .ThrowsAsync(expectedException);

        var query = new GetProjectByLinkQuery { Link = link };

        // Act
        var act = () => _handler.Handle(query, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<Exception>()
            .WithMessage(expectedException.Message);

        MockProjectRepository.Verify(
            x => x.GetByLinkAsync(link, It.IsAny<CancellationToken>()),
            Times.Once);
    }
}
