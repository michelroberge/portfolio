using FluentAssertions;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Tests.Common;
using Xunit;

namespace Portfolio.Infrastructure.Tests.Persistence.Repositories;

public class BlogRepositoryTests : InfrastructureTestBase
{
    [Fact]
    public async Task GetByIdAsync_ExistingBlog_ShouldReturnBlog()
    {
        // Arrange
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

        await BlogRepository.AddAsync(blog);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var result = await BlogRepository.GetByIdAsync(blog.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(blog.Id);
        result.Title.Should().Be(blog.Title);
        result.Excerpt.Should().Be(blog.Excerpt);
        result.Body.Should().Be(blog.Body);
        result.IsDraft.Should().Be(blog.IsDraft);
        result.PublishAt.Should().Be(blog.PublishAt);
        result.Tags.Should().BeEquivalentTo(blog.Tags);
    }

    [Fact]
    public async Task GetByLinkAsync_ExistingBlog_ShouldReturnBlog()
    {
        // Arrange
        var blog = new Blog(
            id: "test-id",
            title: "Test Blog",
            excerpt: "Test Excerpt",
            body: "Test Body",
            isDraft: false,
            publishAt: null,
            vectorId: 1
        );

        await BlogRepository.AddAsync(blog);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var result = await BlogRepository.GetByLinkAsync(blog.Link);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(blog.Id);
        result.Link.Should().Be(blog.Link);
    }

    [Fact]
    public async Task GetPublishedAsync_ShouldReturnOnlyPublishedBlogs()
    {
        // Arrange
        var publishedBlog1 = new Blog(
            id: "published-1",
            title: "Published Blog 1",
            excerpt: "Excerpt 1",
            body: "Body 1",
            isDraft: false,
            publishAt: DateTime.UtcNow.AddDays(-1),
            vectorId: 1
        );

        var publishedBlog2 = new Blog(
            id: "published-2",
            title: "Published Blog 2",
            excerpt: "Excerpt 2",
            body: "Body 2",
            isDraft: false,
            publishAt: null,
            vectorId: 2
        );

        var draftBlog = new Blog(
            id: "draft",
            title: "Draft Blog",
            excerpt: "Draft Excerpt",
            body: "Draft Body",
            isDraft: true,
            publishAt: null,
            vectorId: 3
        );

        var futureBlog = new Blog(
            id: "future",
            title: "Future Blog",
            excerpt: "Future Excerpt",
            body: "Future Body",
            isDraft: false,
            publishAt: DateTime.UtcNow.AddDays(1),
            vectorId: 4
        );

        await BlogRepository.AddAsync(publishedBlog1);
        await BlogRepository.AddAsync(publishedBlog2);
        await BlogRepository.AddAsync(draftBlog);
        await BlogRepository.AddAsync(futureBlog);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var result = await BlogRepository.GetPublishedAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(b => b.Id == publishedBlog1.Id);
        result.Should().Contain(b => b.Id == publishedBlog2.Id);
    }

    [Fact]
    public async Task AddAsync_ValidBlog_ShouldAddAndGenerateId()
    {
        // Arrange
        var blog = new Blog(
            id: "test-id",
            title: "Test Blog",
            excerpt: "Test Excerpt",
            body: "Test Body",
            isDraft: false,
            publishAt: null,
            vectorId: 1
        );

        // Act
        var result = await BlogRepository.AddAsync(blog);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(blog.Id);

        var savedBlog = await BlogRepository.GetByIdAsync(blog.Id);
        savedBlog.Should().NotBeNull();
        savedBlog!.Title.Should().Be(blog.Title);
    }

    [Fact]
    public async Task UpdateAsync_ExistingBlog_ShouldUpdateProperties()
    {
        // Arrange
        var blog = new Blog(
            id: "test-id",
            title: "Test Blog",
            excerpt: "Test Excerpt",
            body: "Test Body",
            isDraft: true,
            publishAt: null,
            vectorId: 1
        );

        await BlogRepository.AddAsync(blog);
        await UnitOfWork.SaveChangesAsync();

        // Act
        blog.UpdateTitle("Updated Title");
        blog.UpdateExcerpt("Updated Excerpt");
        blog.UpdateBody("Updated Body");
        blog.Publish(DateTime.UtcNow);

        await BlogRepository.UpdateAsync(blog);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        var updatedBlog = await BlogRepository.GetByIdAsync(blog.Id);
        updatedBlog.Should().NotBeNull();
        updatedBlog!.Title.Should().Be("Updated Title");
        updatedBlog.Excerpt.Should().Be("Updated Excerpt");
        updatedBlog.Body.Should().Be("Updated Body");
        updatedBlog.IsDraft.Should().BeFalse();
        updatedBlog.PublishAt.Should().NotBeNull();
    }

    [Fact]
    public async Task DeleteAsync_ExistingBlog_ShouldRemoveBlog()
    {
        // Arrange
        var blog = new Blog(
            id: "test-id",
            title: "Test Blog",
            excerpt: "Test Excerpt",
            body: "Test Body",
            isDraft: false,
            publishAt: null,
            vectorId: 1
        );

        await BlogRepository.AddAsync(blog);
        await UnitOfWork.SaveChangesAsync();

        // Act
        await BlogRepository.DeleteAsync(blog);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        var deletedBlog = await BlogRepository.GetByIdAsync(blog.Id);
        deletedBlog.Should().BeNull();
    }

    [Fact]
    public async Task GetNextVectorIdAsync_ShouldReturnIncrementedId()
    {
        // Arrange
        var blog1 = new Blog(
            id: "test-1",
            title: "Test Blog 1",
            excerpt: "Excerpt 1",
            body: "Body 1",
            isDraft: false,
            publishAt: null,
            vectorId: 1
        );

        var blog2 = new Blog(
            id: "test-2",
            title: "Test Blog 2",
            excerpt: "Excerpt 2",
            body: "Body 2",
            isDraft: false,
            publishAt: null,
            vectorId: 2
        );

        await BlogRepository.AddAsync(blog1);
        await BlogRepository.AddAsync(blog2);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var nextVectorId = await BlogRepository.GetNextVectorIdAsync();

        // Assert
        nextVectorId.Should().Be(3);
    }
}
