using Portfolio.Domain.Entities;
using Portfolio.Domain.Exceptions;

namespace Portfolio.Domain.Tests.Entities;

public class ProjectTests
{
    private const string ValidId = "test-id";
    private const string ValidTitle = "Test Project Title";
    private const string ValidDescription = "Test project description";
    private const string ValidGithubUrl = "https://github.com/test/project";
    private const string ValidLiveUrl = "https://test-project.com";
    private const string ValidImageUrl = "https://test-project.com/image.jpg";

    [Fact]
    public void Constructor_WithValidParameters_CreatesInstance()
    {
        // Arrange & Act
        var project = new Project(ValidId, ValidTitle, ValidDescription, ValidGithubUrl, ValidLiveUrl, ValidImageUrl);

        // Assert
        Assert.NotNull(project);
        Assert.Equal(ValidId, project.Id);
        Assert.Equal(ValidTitle, project.Title);
        Assert.Equal(ValidDescription, project.Description);
        Assert.Equal(ValidGithubUrl, project.GithubUrl);
        Assert.Equal(ValidLiveUrl, project.LiveUrl);
        Assert.Equal(ValidImageUrl, project.ImageUrl);
        Assert.Empty(project.Technologies);
        Assert.NotNull(project.Link);
        Assert.Contains(ValidId, project.Link);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidTitle_ThrowsDomainValidationException(string invalidTitle)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new Project(ValidId, invalidTitle, ValidDescription));
        Assert.Equal("Title cannot be empty", exception.Message);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidDescription_ThrowsDomainValidationException(string invalidDescription)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new Project(ValidId, ValidTitle, invalidDescription));
        Assert.Equal("Description cannot be empty", exception.Message);
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("ftp://invalid-scheme.com")]
    public void Constructor_WithInvalidGithubUrl_ThrowsDomainValidationException(string invalidUrl)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new Project(ValidId, ValidTitle, ValidDescription, githubUrl: invalidUrl));
        Assert.Equal("githubUrl must be a valid HTTP/HTTPS URL", exception.Message);
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("ftp://invalid-scheme.com")]
    public void Constructor_WithInvalidLiveUrl_ThrowsDomainValidationException(string invalidUrl)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new Project(ValidId, ValidTitle, ValidDescription, liveUrl: invalidUrl));
        Assert.Equal("liveUrl must be a valid HTTP/HTTPS URL", exception.Message);
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("ftp://invalid-scheme.com")]
    public void Constructor_WithInvalidImageUrl_ThrowsDomainValidationException(string invalidUrl)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new Project(ValidId, ValidTitle, ValidDescription, imageUrl: invalidUrl));
        Assert.Equal("imageUrl must be a valid HTTP/HTTPS URL", exception.Message);
    }

    [Fact]
    public void UpdateTitle_WithValidTitle_UpdatesTitleAndLink()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription);
        var newTitle = "Updated Title";

        // Act
        project.UpdateTitle(newTitle);

        // Assert
        Assert.Equal(newTitle, project.Title);
        Assert.Contains("updated-title", project.Link?.ToLower());
        Assert.Contains(ValidId, project.Link);
    }

    [Fact]
    public void UpdateDescription_WithValidDescription_UpdatesDescription()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription);
        var newDescription = "Updated description";

        // Act
        project.UpdateDescription(newDescription);

        // Assert
        Assert.Equal(newDescription, project.Description);
    }

    [Fact]
    public void UpdateGithubUrl_WithValidUrl_UpdatesGithubUrl()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription);
        var newUrl = "https://github.com/test/updated";

        // Act
        project.UpdateGithubUrl(newUrl);

        // Assert
        Assert.Equal(newUrl, project.GithubUrl);
    }

    [Fact]
    public void UpdateLiveUrl_WithValidUrl_UpdatesLiveUrl()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription);
        var newUrl = "https://updated-project.com";

        // Act
        project.UpdateLiveUrl(newUrl);

        // Assert
        Assert.Equal(newUrl, project.LiveUrl);
    }

    [Fact]
    public void UpdateImageUrl_WithValidUrl_UpdatesImageUrl()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription);
        var newUrl = "https://updated-project.com/image.jpg";

        // Act
        project.UpdateImageUrl(newUrl);

        // Assert
        Assert.Equal(newUrl, project.ImageUrl);
    }

    [Fact]
    public void AddTechnology_WithValidTechnology_AddsTechnologyToCollection()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription);
        var technology = "test-tech";

        // Act
        project.AddTechnology(technology);

        // Assert
        Assert.Single(project.Technologies);
        Assert.Contains(technology.ToLowerInvariant(), project.Technologies);
    }

    [Fact]
    public void AddTechnology_WithDuplicateTechnology_DoesNotAddDuplicate()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription);
        var technology = "test-tech";

        // Act
        project.AddTechnology(technology);
        project.AddTechnology(technology.ToUpper()); // Try to add same technology with different casing

        // Assert
        Assert.Single(project.Technologies);
        Assert.Contains(technology.ToLowerInvariant(), project.Technologies);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void AddTechnology_WithInvalidTechnology_ThrowsDomainValidationException(string invalidTechnology)
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription);

        // Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() => project.AddTechnology(invalidTechnology));
        Assert.Equal("Technology cannot be empty", exception.Message);
    }

    [Fact]
    public void RemoveTechnology_WithExistingTechnology_RemovesTechnology()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription);
        var technology = "test-tech";
        project.AddTechnology(technology);

        // Act
        project.RemoveTechnology(technology);

        // Assert
        Assert.Empty(project.Technologies);
    }

    [Fact]
    public void ClearTechnologies_WithExistingTechnologies_RemovesAllTechnologies()
    {
        // Arrange
        var project = new Project(ValidId, ValidTitle, ValidDescription);
        project.AddTechnology("tech1");
        project.AddTechnology("tech2");

        // Act
        project.ClearTechnologies();

        // Assert
        Assert.Empty(project.Technologies);
    }
}
