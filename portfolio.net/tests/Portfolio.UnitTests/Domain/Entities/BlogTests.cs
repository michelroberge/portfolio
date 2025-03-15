using FluentAssertions;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Exceptions;
using Xunit;

namespace Portfolio.UnitTests.Domain.Entities;

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
        blog.Should().NotBeNull();
        blog.Id.Should().Be(ValidId);
        blog.Title.Should().Be(ValidTitle);
        blog.Excerpt.Should().Be(ValidExcerpt);
        blog.Body.Should().Be(ValidBody);
        blog.IsDraft.Should().BeTrue();
        blog.Tags.Should().BeEmpty();
        blog.Link.Should().NotBeNull();
        blog.Link.Should().Contain(ValidId);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidTitle_ThrowsDomainValidationException(string invalidTitle)
    {
        // Arrange & Act
        var action = () => new Blog(ValidId, invalidTitle, ValidExcerpt, ValidBody);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Title cannot be empty");
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidExcerpt_ThrowsDomainValidationException(string invalidExcerpt)
    {
        // Arrange & Act
        var action = () => new Blog(ValidId, ValidTitle, invalidExcerpt, ValidBody);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Excerpt cannot be empty");
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidBody_ThrowsDomainValidationException(string invalidBody)
    {
        // Arrange & Act
        var action = () => new Blog(ValidId, ValidTitle, ValidExcerpt, invalidBody);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Body cannot be empty");
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
        blog.Title.Should().Be(newTitle);
        blog.Link.ToLower().Should().Contain("updated-title");
        blog.Link.Should().Contain(ValidId);
        blog.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
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
        blog.Excerpt.Should().Be(newExcerpt);
        blog.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
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
        blog.Body.Should().Be(newBody);
        blog.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
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
        blog.Tags.Should().HaveCount(1);
        blog.Tags.Should().Contain(tag.ToLowerInvariant());
        blog.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
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
        blog.Tags.Should().HaveCount(1);
        blog.Tags.Should().Contain(tag.ToLowerInvariant());
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void AddTag_WithInvalidTag_ThrowsDomainValidationException(string invalidTag)
    {
        // Arrange
        var blog = new Blog(ValidId, ValidTitle, ValidExcerpt, ValidBody);

        // Act
        var action = () => blog.AddTag(invalidTag);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Tag cannot be empty");
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
        blog.Tags.Should().BeEmpty();
        blog.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
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
        blog.Tags.Should().BeEmpty();
        blog.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UpdateDraftStatus_ChangesStatus()
    {
        // Arrange
        var blog = new Blog(ValidId, ValidTitle, ValidExcerpt, ValidBody);
        blog.IsDraft.Should().BeTrue(); // Default is true

        // Act
        blog.UpdateDraftStatus(false);

        // Assert
        blog.IsDraft.Should().BeFalse();
        blog.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
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
        blog.PublishDate.Should().Be(publishDate);
        blog.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }
}
