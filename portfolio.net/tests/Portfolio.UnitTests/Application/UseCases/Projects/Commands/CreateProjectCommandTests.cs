using FluentAssertions;
using Moq;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Tests.Common;
using Portfolio.Application.UseCases.Projects.Commands.CreateProject;
using Portfolio.Domain.Entities;
using Xunit;

namespace Portfolio.Application.Tests.UseCases.Projects.Commands;

public class CreateProjectCommandTests : TestBase
{
    private readonly CreateProjectCommandHandler _handler;
    private readonly CreateProjectCommandValidator _validator;

    public CreateProjectCommandTests()
    {
        _handler = new CreateProjectCommandHandler(
            MockProjectRepository.Object,
            Mapper,
            ServiceProvider.GetService<Microsoft.Extensions.Logging.ILogger<CreateProjectCommandHandler>>()!);

        _validator = new CreateProjectCommandValidator();
    }

    [Fact]
    public async Task Handle_ValidProject_ShouldCreateProjectAndReturnDto()
    {
        // Arrange
        var command = new CreateProjectCommand
        {
            Title = "Test Project",
            Description = "Test Description",
            GithubUrl = "https://github.com/test/project",
            LiveUrl = "https://test-project.com",
            ImageUrl = "https://test-project.com/image.jpg",
            Technologies = new[] { "C#", ".NET" }
        };

        var expectedProject = new Project(
            id: "test-id",
            title: command.Title,
            description: command.Description,
            githubUrl: command.GithubUrl,
            liveUrl: command.LiveUrl,
            imageUrl: command.ImageUrl,
            vectorId: 1
        );

        foreach (var tech in command.Technologies)
        {
            expectedProject.AddTechnology(tech);
        }

        MockProjectRepository
            .Setup(x => x.GetNextVectorIdAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        MockProjectRepository
            .Setup(x => x.AddAsync(It.IsAny<Project>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedProject);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<ProjectDto>();
        result.Title.Should().Be(command.Title);
        result.Description.Should().Be(command.Description);
        result.GithubUrl.Should().Be(command.GithubUrl);
        result.LiveUrl.Should().Be(command.LiveUrl);
        result.ImageUrl.Should().Be(command.ImageUrl);
        result.Technologies.Should().BeEquivalentTo(command.Technologies);

        MockProjectRepository.Verify(
            x => x.AddAsync(It.IsAny<Project>(), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Theory]
    [InlineData("", "Description")] // Empty title
    [InlineData("Title", "")] // Empty description
    [InlineData("Title", "Description", "invalid-url")] // Invalid GitHub URL
    [InlineData("Title", "Description", "https://github.com/test", "invalid-url")] // Invalid Live URL
    public async Task Validate_InvalidProject_ShouldFailValidation(
        string title,
        string description,
        string? githubUrl = null,
        string? liveUrl = null)
    {
        // Arrange
        var command = new CreateProjectCommand
        {
            Title = title,
            Description = description,
            GithubUrl = githubUrl,
            LiveUrl = liveUrl
        };

        // Act
        var result = await _validator.ValidateAsync(command);

        // Assert
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public async Task Validate_ValidProject_ShouldPassValidation()
    {
        // Arrange
        var command = new CreateProjectCommand
        {
            Title = "Test Project",
            Description = "Test Description",
            GithubUrl = "https://github.com/test/project",
            LiveUrl = "https://test-project.com",
            ImageUrl = "https://test-project.com/image.jpg",
            Technologies = new[] { "C#", ".NET" }
        };

        // Act
        var result = await _validator.ValidateAsync(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }
}
