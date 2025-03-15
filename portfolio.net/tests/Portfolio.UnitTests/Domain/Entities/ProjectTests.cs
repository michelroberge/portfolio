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
            description: ValidDescription,
            link: ValidLink,
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
        var action = () => new Project(
            id: ValidId,
            title: invalidTitle,
            description: ValidDescription,
            link: ValidLink
        );

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Title cannot be empty");
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidDescription_ThrowsDomainValidationException(string invalidDescription)
    {
        // Arrange & Act
        var action = () => new Project(
            id: ValidId,
            title: ValidTitle,
            description: invalidDescription,
            link: ValidLink
        );

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Description cannot be empty");
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidLink_ThrowsDomainValidationException(string invalidLink)
    {
        // Arrange & Act
        var action = () => new Project(
            id: ValidId,
            title: ValidTitle,
            description: ValidDescription,
            link: invalidLink
        );

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
        var action = () => new Project(
            id: ValidId,
            title: ValidTitle,
            description: ValidDescription,
            link: ValidLink,
            githubUrl: invalidUrl
        );

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("githubUrl must be a valid HTTP/HTTPS URL");
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("ftp://invalid-scheme.com")]
    public void Constructor_WithInvalidLiveUrl_ThrowsDomainValidationException(string invalidUrl)
    {
        // Arrange & Act
        var action = () => new Project(
            id: ValidId,
            title: ValidTitle,
            description: ValidDescription,
            link: ValidLink,
            liveUrl: invalidUrl
        );

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("liveUrl must be a valid HTTP/HTTPS URL");
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("ftp://invalid-scheme.com")]
    public void Constructor_WithInvalidImageUrl_ThrowsDomainValidationException(string invalidUrl)
    {
        // Arrange & Act
        var action = () => new Project(
            id: ValidId,
            title: ValidTitle,
            description: ValidDescription,
            link: ValidLink,
            imageUrl: invalidUrl
        );

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("imageUrl must be a valid HTTP/HTTPS URL");
    }

    [Fact]
    public void UpdateTitle_WithValidTitle_UpdatesTitle()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        var newTitle = "Updated Title";

        // Act
        project.UpdateTitle(newTitle);

        // Assert
        project.Title.Should().Be(newTitle);
        project.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UpdateDescription_WithValidDescription_UpdatesDescription()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        var newDescription = "Updated description";

        // Act
        project.UpdateDescription(newDescription);

        // Assert
        project.Description.Should().Be(newDescription);
        project.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UpdateLink_WithValidLink_UpdatesLink()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        var newLink = "updated-link";

        // Act
        project.UpdateLink(newLink);

        // Assert
        project.Link.Should().Be(newLink);
        project.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UpdateGithubUrl_WithValidUrl_UpdatesGithubUrl()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        var newUrl = "https://github.com/test/updated";

        // Act
        project.UpdateGithubUrl(newUrl);

        // Assert
        project.GithubUrl.Should().Be(newUrl);
        project.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UpdateLiveUrl_WithValidUrl_UpdatesLiveUrl()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        var newUrl = "https://updated-project.com";

        // Act
        project.UpdateLiveUrl(newUrl);

        // Assert
        project.LiveUrl.Should().Be(newUrl);
        project.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UpdateImageUrl_WithValidUrl_UpdatesImageUrl()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        var newUrl = "https://updated-project.com/image.jpg";

        // Act
        project.UpdateImageUrl(newUrl);

        // Assert
        project.ImageUrl.Should().Be(newUrl);
        project.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Publish_SetsIsDraftToFalse()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        project.IsDraft.Should().BeTrue();

        // Act
        project.Publish();

        // Assert
        project.IsDraft.Should().BeFalse();
        project.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UnPublish_SetsIsDraftToTrue()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        project.Publish();
        project.IsDraft.Should().BeFalse();

        // Act
        project.UnPublish();

        // Assert
        project.IsDraft.Should().BeTrue();
        project.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Feature_SetsIsFeaturedToTrue()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        project.IsFeatured.Should().BeFalse();

        // Act
        project.Feature();

        // Assert
        project.IsFeatured.Should().BeTrue();
        project.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UnFeature_SetsIsFeaturedToFalse()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        project.Feature();
        project.IsFeatured.Should().BeTrue();

        // Act
        project.UnFeature();

        // Assert
        project.IsFeatured.Should().BeFalse();
        project.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void AddTechnology_WithValidTechnology_AddsTechnologyToCollection()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        var technology = "test-tech";

        // Act
        project.AddTechnology(technology);

        // Assert
        project.Technologies.Should().HaveCount(1);
        project.Technologies.Should().Contain(technology.ToLowerInvariant());
        project.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void AddTechnology_WithDuplicateTechnology_DoesNotAddDuplicate()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        var technology = "test-tech";

        // Act
        project.AddTechnology(technology);
        project.AddTechnology(technology.ToUpper()); // Try to add same technology with different casing

        // Assert
        project.Technologies.Should().HaveCount(1);
        project.Technologies.Should().Contain(technology.ToLowerInvariant());
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void AddTechnology_WithInvalidTechnology_ThrowsDomainValidationException(string invalidTechnology)
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);

        // Act
        var action = () => project.AddTechnology(invalidTechnology);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Technology cannot be empty");
    }

    [Fact]
    public void RemoveTechnology_WithExistingTechnology_RemovesTechnology()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        var technology = "test-tech";
        project.AddTechnology(technology);

        // Act
        project.RemoveTechnology(technology);

        // Assert
        project.Technologies.Should().BeEmpty();
        project.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void ClearTechnologies_WithExistingTechnologies_RemovesAllTechnologies()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidLink);
        project.AddTechnology("tech1");
        project.AddTechnology("tech2");

        // Act
        project.ClearTechnologies();

        // Assert
        project.Technologies.Should().BeEmpty();
        project.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }
}
