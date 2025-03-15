using Portfolio.Domain.Entities;
using Portfolio.Domain.Exceptions;

namespace Portfolio.Domain.Tests.Entities;

public class BlogTests
{
    private const string ValidId = "test-id";
    private const string ValidTitle = "Test Blog Title";
    private const string ValidExcerpt = "Test blog excerpt";
    private const string ValidBody = "Test blog body with detailed content";

    [Fact]
    public void Constructor_WithValidParameters_CreatesInstance()
    {
        // Arrange & Act
        var blog = new Blog(ValidId, ValidTitle, ValidExcerpt, ValidBody);

        // Assert
        Assert.NotNull(blog);
        Assert.Equal(ValidId, blog.Id);
        Assert.Equal(ValidTitle, blog.Title);
        Assert.Equal(ValidExcerpt, blog.Excerpt);
        Assert.Equal(ValidBody, blog.Body);
        Assert.True(blog.IsDraft);
        Assert.Empty(blog.Tags);
        Assert.NotNull(blog.Link);
        Assert.Contains(ValidId, blog.Link);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidTitle_ThrowsDomainValidationException(string invalidTitle)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new Blog(ValidId, invalidTitle, ValidExcerpt, ValidBody));
        Assert.Equal("Title cannot be empty", exception.Message);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidExcerpt_ThrowsDomainValidationException(string invalidExcerpt)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new Blog(ValidId, ValidTitle, invalidExcerpt, ValidBody));
        Assert.Equal("Excerpt cannot be empty", exception.Message);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidBody_ThrowsDomainValidationException(string invalidBody)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new Blog(ValidId, ValidTitle, ValidExcerpt, invalidBody));
        Assert.Equal("Body cannot be empty", exception.Message);
    }

    [Fact]
    public void UpdateTitle_WithValidTitle_UpdatesTitleAndLink()
    {
        // Arrange
        var blog = new Blog(ValidId, ValidTitle, ValidExcerpt, ValidBody);
        var newTitle = "Updated Title";

        // Act
        blog.UpdateTitle(newTitle);

        // Assert
        Assert.Equal(newTitle, blog.Title);
        Assert.Contains("updated-title", blog.Link?.ToLower());
        Assert.Contains(ValidId, blog.Link);
    }

    [Fact]
    public void UpdateExcerpt_WithValidExcerpt_UpdatesExcerpt()
    {
        // Arrange
        var blog = new Blog(ValidId, ValidTitle, ValidExcerpt, ValidBody);
        var newExcerpt = "Updated excerpt";

        // Act
        blog.UpdateExcerpt(newExcerpt);

        // Assert
        Assert.Equal(newExcerpt, blog.Excerpt);
    }

    [Fact]
    public void UpdateBody_WithValidBody_UpdatesBody()
    {
        // Arrange
        var blog = new Blog(ValidId, ValidTitle, ValidExcerpt, ValidBody);
        var newBody = "Updated body content";

        // Act
        blog.UpdateBody(newBody);

        // Assert
        Assert.Equal(newBody, blog.Body);
    }

    [Fact]
    public void AddTag_WithValidTag_AddsTagToCollection()
    {
        // Arrange
        var blog = new Blog(ValidId, ValidTitle, ValidExcerpt, ValidBody);
        var tag = "test-tag";

        // Act
        blog.AddTag(tag);

        // Assert
        Assert.Single(blog.Tags);
        Assert.Contains(tag.ToLowerInvariant(), blog.Tags);
    }

    [Fact]
    public void AddTag_WithDuplicateTag_DoesNotAddDuplicate()
    {
        // Arrange
        var blog = new Blog(ValidId, ValidTitle, ValidExcerpt, ValidBody);
        var tag = "test-tag";

        // Act
        blog.AddTag(tag);
        blog.AddTag(tag.ToUpper()); // Try to add same tag with different casing

        // Assert
        Assert.Single(blog.Tags);
        Assert.Contains(tag.ToLowerInvariant(), blog.Tags);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void AddTag_WithInvalidTag_ThrowsDomainValidationException(string invalidTag)
    {
        // Arrange
        var blog = new Blog(ValidId, ValidTitle, ValidExcerpt, ValidBody);

        // Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() => blog.AddTag(invalidTag));
        Assert.Equal("Tag cannot be empty", exception.Message);
    }

    [Fact]
    public void RemoveTag_WithExistingTag_RemovesTag()
    {
        // Arrange
        var blog = new Blog(ValidId, ValidTitle, ValidExcerpt, ValidBody);
        var tag = "test-tag";
        blog.AddTag(tag);

        // Act
        blog.RemoveTag(tag);

        // Assert
        Assert.Empty(blog.Tags);
    }

    [Fact]
    public void ClearTags_WithExistingTags_RemovesAllTags()
    {
        // Arrange
        var blog = new Blog(ValidId, ValidTitle, ValidExcerpt, ValidBody);
        blog.AddTag("tag1");
        blog.AddTag("tag2");

        // Act
        blog.ClearTags();

        // Assert
        Assert.Empty(blog.Tags);
    }

    [Fact]
    public void UpdateDraftStatus_ChangesStatus()
    {
        // Arrange
        var blog = new Blog(ValidId, ValidTitle, ValidExcerpt, ValidBody);
        Assert.True(blog.IsDraft); // Default is true

        // Act
        blog.UpdateDraftStatus(false);

        // Assert
        Assert.False(blog.IsDraft);
    }

    [Fact]
    public void UpdatePublishDate_SetsPublishDate()
    {
        // Arrange
        var blog = new Blog(ValidId, ValidTitle, ValidExcerpt, ValidBody);
        var publishDate = DateTime.UtcNow;

        // Act
        blog.UpdatePublishDate(publishDate);

        // Assert
        Assert.Equal(publishDate, blog.PublishAt);
    }
}
