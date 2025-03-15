using FluentAssertions;
using Moq;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Tests.Common;
using Portfolio.Application.UseCases.Blogs.Commands.CreateBlog;
using Portfolio.Domain.Entities;
using Xunit;

namespace Portfolio.Application.Tests.UseCases.Blogs.Commands;

public class CreateBlogCommandTests : TestBase
{
    private readonly CreateBlogCommandHandler _handler;
    private readonly CreateBlogCommandValidator _validator;

    public CreateBlogCommandTests()
    {
        _handler = new CreateBlogCommandHandler(
            MockBlogRepository.Object,
            Mapper,
            ServiceProvider.GetService<Microsoft.Extensions.Logging.ILogger<CreateBlogCommandHandler>>()!);

        _validator = new CreateBlogCommandValidator();
    }

    [Fact]
    public async Task Handle_ValidBlog_ShouldCreateBlogAndReturnDto()
    {
        // Arrange
        var command = new CreateBlogCommand
        {
            Title = "Test Blog",
            Excerpt = "Test Excerpt",
            Body = "Test Body",
            IsDraft = true,
            Tags = new[] { "test", "blog" }
        };

        var expectedBlog = new Blog(
            id: "test-id",
            title: command.Title,
            excerpt: command.Excerpt,
            body: command.Body,
            isDraft: command.IsDraft,
            publishAt: null,
            vectorId: 1
        );

        foreach (var tag in command.Tags)
        {
            expectedBlog.AddTag(tag);
        }

        MockBlogRepository
            .Setup(x => x.GetNextVectorIdAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        MockBlogRepository
            .Setup(x => x.AddAsync(It.IsAny<Blog>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedBlog);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<BlogDto>();
        result.Title.Should().Be(command.Title);
        result.Excerpt.Should().Be(command.Excerpt);
        result.Body.Should().Be(command.Body);
        result.IsDraft.Should().Be(command.IsDraft);
        result.Tags.Should().BeEquivalentTo(command.Tags);

        MockBlogRepository.Verify(
            x => x.AddAsync(It.IsAny<Blog>(), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Theory]
    [InlineData("", "Excerpt", "Body")] // Empty title
    [InlineData("Title", "", "Body")] // Empty excerpt
    [InlineData("Title", "Excerpt", "")] // Empty body
    public async Task Validate_InvalidBlog_ShouldFailValidation(string title, string excerpt, string body)
    {
        // Arrange
        var command = new CreateBlogCommand
        {
            Title = title,
            Excerpt = excerpt,
            Body = body,
            IsDraft = true
        };

        // Act
        var result = await _validator.ValidateAsync(command);

        // Assert
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public async Task Validate_ValidBlog_ShouldPassValidation()
    {
        // Arrange
        var command = new CreateBlogCommand
        {
            Title = "Test Blog",
            Excerpt = "Test Excerpt",
            Body = "Test Body",
            IsDraft = true,
            Tags = new[] { "test", "blog" }
        };

        // Act
        var result = await _validator.ValidateAsync(command);

        // Assert
        result.IsValid.Should().BeTrue();
    }
}
