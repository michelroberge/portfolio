using FluentAssertions;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Exceptions;
using Xunit;

namespace Portfolio.UnitTests.Domain.Entities;

public class ProjectTests
{
    private const string ValidId = "test-id";
    private const string ValidTitle = "Test Project Title";
    private const string ValidDescription = "Test project description";
    private const string ValidLink = "test-project-title";
    private const string ValidGithubUrl = "https://github.com/test/project";
    private const string ValidLiveUrl = "https://test-project.com";
    private const string ValidImageUrl = "https://test-project.com/image.jpg";

    [Fact]
    public void Constructor_WithValidParameters_CreatesInstance()
    {
        // Arrange & Act
        var project = new Project(
            id: ValidId,
            title: ValidTitle,
            link: ValidLink,
            description: ValidDescription,
            githubUrl: ValidGithubUrl,
            liveUrl: ValidLiveUrl,
            imageUrl: ValidImageUrl,
            isDraft: true,
            isFeatured: false,
            vectorId: 1
        );

        // Assert
        project.Should().NotBeNull();
        project.Id.Should().Be(ValidId);
        project.Title.Should().Be(ValidTitle);
        project.Description.Should().Be(ValidDescription);
        project.Link.Should().Be(ValidLink);
        project.GithubUrl.Should().Be(ValidGithubUrl);
        project.LiveUrl.Should().Be(ValidLiveUrl);
        project.ImageUrl.Should().Be(ValidImageUrl);
        project.IsDraft.Should().BeTrue();
        project.IsFeatured.Should().BeFalse();
        project.VectorId.Should().Be(1);
        project.Technologies.Should().BeEmpty();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidTitle_ThrowsDomainValidationException(string invalidTitle)
    {
        // Arrange & Act
        var project = new Project(ValidId);
        var action = () => project.Title = invalidTitle;

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Title cannot be empty");
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidLink_ThrowsDomainValidationException(string invalidLink)
    {
        // Arrange & Act
        var project = new Project(ValidId);
        var action = () => project.Link = invalidLink;

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Link cannot be empty");
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("ftp://invalid-scheme.com")]
    public void Constructor_WithInvalidGithubUrl_ThrowsDomainValidationException(string invalidUrl)
    {
        // Arrange & Act
        var project = new Project(ValidId);
        var action = () => project.GithubUrl = invalidUrl;

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("GithubUrl must be a valid HTTP/HTTPS URL");
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("ftp://invalid-scheme.com")]
    public void Constructor_WithInvalidLiveUrl_ThrowsDomainValidationException(string invalidUrl)
    {
        // Arrange & Act
        var project = new Project(ValidId);
        var action = () => project.LiveUrl = invalidUrl;

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("LiveUrl must be a valid HTTP/HTTPS URL");
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("ftp://invalid-scheme.com")]
    public void Constructor_WithInvalidImageUrl_ThrowsDomainValidationException(string invalidUrl)
    {
        // Arrange & Act
        var project = new Project(ValidId);
        var action = () => project.ImageUrl = invalidUrl;

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("ImageUrl must be a valid HTTP/HTTPS URL");
    }

    [Fact]
    public void UpdateTitle_WithValidTitle_UpdatesTitle()
    {
        // Arrange
        var project = new Project(ValidId);
        var newTitle = "Updated Title";

        // Act
        project.Title = newTitle;

        // Assert
        project.Title.Should().Be(newTitle);
        project.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UpdateDescription_WithValidDescription_UpdatesDescription()
    {
        // Arrange
        var project = new Project(ValidId);
        var newDescription = "Updated description";

        // Act
        project.Description = newDescription;

        // Assert
        project.Description.Should().Be(newDescription);
        project.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void AddTechnology_WithValidTechnology_AddsTechnology()
    {
        // Arrange
        var project = new Project(ValidId);
        var technology = "C#";

        // Act
        project.Technologies.Add(technology);

        // Assert
        project.Technologies.Should().Contain(technology);
    }
}
