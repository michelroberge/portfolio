using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Tests.Common;
using Portfolio.Application.UseCases.Blogs.Queries.GetBlogByLink;
using Portfolio.Domain.Entities;
using Xunit;

namespace Portfolio.Application.Tests.UseCases.Blogs.Queries;

public class GetBlogByLinkQueryTests : TestBase
{
    private readonly GetBlogByLinkQueryHandler _handler;

    public GetBlogByLinkQueryTests()
    {
        _handler = new GetBlogByLinkQueryHandler(
            MockBlogRepository.Object,
            Mapper,
            ServiceProvider.GetService<Microsoft.Extensions.Logging.ILogger<GetBlogByLinkQueryHandler>>()!);
    }

    [Fact]
    public async Task Handle_ExistingBlog_ShouldReturnBlogDto()
    {
        // Arrange
        var link = "test-blog";
        var blog = new Blog(
            id: "test-id",
            title: "Test Blog",
            excerpt: "Test Excerpt",
            body: "Test Body",
            isDraft: false,
            publishAt: null,
            vectorId: 1
        );

        blog.AddTag("test");
        blog.AddTag("blog");

        MockBlogRepository
            .Setup(x => x.GetByLinkAsync(link, It.IsAny<CancellationToken>()))
            .ReturnsAsync(blog);

        var query = new GetBlogByLinkQuery { Link = link };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<BlogDto>();
        result!.Title.Should().Be(blog.Title);
        result.Excerpt.Should().Be(blog.Excerpt);
        result.Body.Should().Be(blog.Body);
        result.IsDraft.Should().Be(blog.IsDraft);
        result.Tags.Should().BeEquivalentTo(blog.Tags);

        MockBlogRepository.Verify(
            x => x.GetByLinkAsync(link, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_NonExistingBlog_ShouldReturnNull()
    {
        // Arrange
        var link = "non-existing-blog";

        MockBlogRepository
            .Setup(x => x.GetByLinkAsync(link, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Blog?)null);

        var query = new GetBlogByLinkQuery { Link = link };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().BeNull();

        MockBlogRepository.Verify(
            x => x.GetByLinkAsync(link, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_RepositoryThrowsException_ShouldPropagateException()
    {
        // Arrange
        var link = "test-blog";
        var expectedException = new Exception("Test exception");

        MockBlogRepository
            .Setup(x => x.GetByLinkAsync(link, It.IsAny<CancellationToken>()))
            .ThrowsAsync(expectedException);

        var query = new GetBlogByLinkQuery { Link = link };

        // Act
        var act = () => _handler.Handle(query, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<Exception>()
            .WithMessage(expectedException.Message);

        MockBlogRepository.Verify(
            x => x.GetByLinkAsync(link, It.IsAny<CancellationToken>()),
            Times.Once);
    }
}
