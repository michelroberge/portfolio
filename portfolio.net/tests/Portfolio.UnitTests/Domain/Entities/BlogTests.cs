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
    private const string ValidBody = "Test blog body";

    [Fact]
    public void Constructor_WithValidParameters_CreatesInstance()
    {
        // Arrange & Act
        var blog = new Blog(
            id: ValidId,
            title: ValidTitle,
            excerpt: ValidExcerpt,
            body: ValidBody,
            isDraft: true,
            vectorId: 1
        );

        // Assert
        blog.Should().NotBeNull();
        blog.Id.Should().Be(ValidId);
        blog.Title.Should().Be(ValidTitle);
        blog.Excerpt.Should().Be(ValidExcerpt);
        blog.Body.Should().Be(ValidBody);
        blog.IsDraft.Should().BeTrue();
        blog.VectorId.Should().Be(1);
        blog.Link.Should().NotBeEmpty();
        blog.Tags.Should().BeEmpty();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidTitle_ThrowsDomainValidationException(string invalidTitle)
    {
        // Arrange & Act
        var blog = new Blog(ValidId);
        var action = () => blog.Title = invalidTitle;

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Title cannot be empty");
    }

    [Fact]
    public void Title_WhenSet_GeneratesLink()
    {
        // Arrange
        var blog = new Blog(ValidId);
        var title = "This is a Test Title!";
        var expectedLink = "this-is-a-test-title-test-id";

        // Act
        blog.Title = title;

        // Assert
        blog.Link.Should().Be(expectedLink);
        blog.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void AddTag_WithValidTag_AddsToCollection()
    {
        // Arrange
        var blog = new Blog(ValidId);
        var tag = "test-tag";

        // Act
        blog.Tags.Add(tag);

        // Assert
        blog.Tags.Should().Contain(tag);
    }

    [Fact]
    public void Constructor_WithNullId_UsesEmptyString()
    {
        // Arrange & Act
        var blog = new Blog();

        // Assert
        blog.Id.Should().NotBeNull();
        blog.Id.Should().BeEmpty();
        blog.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        blog.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }
}
