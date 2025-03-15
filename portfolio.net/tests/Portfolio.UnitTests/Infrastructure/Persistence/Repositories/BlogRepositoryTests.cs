using FluentAssertions;
using Portfolio.Domain.Entities;
using Xunit;

namespace Portfolio.UnitTests.Infrastructure.Persistence.Repositories;

/// <summary>
/// Integration tests for BlogRepository following Clean Architecture principles.
/// Tests the repository's interaction with the database through Entity Framework Core.
/// </summary>
public class BlogRepositoryTests : TestDbContext
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

        await BlogRepository.AddAsync(blog);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var result = await BlogRepository.GetByIdAsync(blog.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(blog.Id);
        result.Title.Should().Be(blog.Title);
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
    public async Task GetByTagAsync_ExistingBlogs_ShouldReturnMatchingBlogs()
    {
        // Arrange
        var blog1 = new Blog(
            id: "test-1",
            title: "Blog 1",
            excerpt: "Excerpt 1",
            body: "Body 1",
            isDraft: false,
            publishAt: null,
            vectorId: 1
        );
        blog1.AddTag("dotnet");
        blog1.AddTag("architecture");

        var blog2 = new Blog(
            id: "test-2",
            title: "Blog 2",
            excerpt: "Excerpt 2",
            body: "Body 2",
            isDraft: false,
            publishAt: null,
            vectorId: 2
        );
        blog2.AddTag("dotnet");
        blog2.AddTag("testing");

        var blog3 = new Blog(
            id: "test-3",
            title: "Blog 3",
            excerpt: "Excerpt 3",
            body: "Body 3",
            isDraft: false,
            publishAt: null,
            vectorId: 3
        );
        blog3.AddTag("javascript");
        blog3.AddTag("architecture");

        await BlogRepository.AddAsync(blog1);
        await BlogRepository.AddAsync(blog2);
        await BlogRepository.AddAsync(blog3);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var dotnetBlogs = await BlogRepository.GetByTagAsync("dotnet");
        var architectureBlogs = await BlogRepository.GetByTagAsync("architecture");
        var testingBlogs = await BlogRepository.GetByTagAsync("testing");
        var pythonBlogs = await BlogRepository.GetByTagAsync("python");

        // Assert
        dotnetBlogs.Should().HaveCount(2);
        dotnetBlogs.Should().Contain(b => b.Id == blog1.Id);
        dotnetBlogs.Should().Contain(b => b.Id == blog2.Id);

        architectureBlogs.Should().HaveCount(2);
        architectureBlogs.Should().Contain(b => b.Id == blog1.Id);
        architectureBlogs.Should().Contain(b => b.Id == blog3.Id);

        testingBlogs.Should().HaveCount(1);
        testingBlogs.Should().Contain(b => b.Id == blog2.Id);

        pythonBlogs.Should().BeEmpty();
    }

    [Fact]
    public async Task GetNextVectorIdAsync_MultipleBlogs_ShouldReturnNextId()
    {
        // Arrange
        var blog1 = new Blog(
            id: "test-1",
            title: "Blog 1",
            excerpt: "Excerpt 1",
            body: "Body 1",
            isDraft: false,
            publishAt: null,
            vectorId: 1
        );

        var blog2 = new Blog(
            id: "test-2",
            title: "Blog 2",
            excerpt: "Excerpt 2",
            body: "Body 2",
            isDraft: false,
            publishAt: null,
            vectorId: 5
        );

        await BlogRepository.AddAsync(blog1);
        await BlogRepository.AddAsync(blog2);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var nextVectorId = await BlogRepository.GetNextVectorIdAsync();

        // Assert
        nextVectorId.Should().Be(6);
    }

    [Fact]
    public async Task GetNextVectorIdAsync_NoBlogs_ShouldReturnOne()
    {
        // Act
        var nextVectorId = await BlogRepository.GetNextVectorIdAsync();

        // Assert
        nextVectorId.Should().Be(1);
    }

    [Fact]
    public async Task AddAsync_ValidBlog_ShouldGenerateLink()
    {
        // Arrange
        var blog = new Blog(
            id: "test-id",
            title: "Test Blog Title",
            excerpt: "Test Excerpt",
            body: "Test Body",
            isDraft: false,
            publishAt: null,
            vectorId: 1
        );

        // Act
        await BlogRepository.AddAsync(blog);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        var savedBlog = await BlogRepository.GetByIdAsync(blog.Id);
        savedBlog.Should().NotBeNull();
        savedBlog!.Link.Should().NotBeNullOrEmpty();
        savedBlog.Link.Should().Contain(blog.Title.ToLower().Replace(" ", "-"));
    }

    [Fact]
    public async Task UpdateAsync_ChangingTitle_ShouldUpdateLink()
    {
        // Arrange
        var blog = new Blog(
            id: "test-id",
            title: "Original Title",
            excerpt: "Test Excerpt",
            body: "Test Body",
            isDraft: false,
            publishAt: null,
            vectorId: 1
        );

        await BlogRepository.AddAsync(blog);
        await UnitOfWork.SaveChangesAsync();

        // Act
        blog.UpdateTitle("Updated Title");
        await BlogRepository.UpdateAsync(blog);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        var updatedBlog = await BlogRepository.GetByIdAsync(blog.Id);
        updatedBlog.Should().NotBeNull();
        updatedBlog!.Title.Should().Be("Updated Title");
        updatedBlog.Link.Should().Contain("updated-title");
    }

    [Fact]
    public async Task GetPublishedAsync_WithPublishedAndDraftBlogs_ShouldReturnOnlyPublished()
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
            publishAt: DateTime.UtcNow.AddDays(-2),
            vectorId: 2
        );

        var draftBlog = new Blog(
            id: "draft-1",
            title: "Draft Blog",
            excerpt: "Draft Excerpt",
            body: "Draft Body",
            isDraft: true,
            publishAt: null,
            vectorId: 3
        );

        var scheduledBlog = new Blog(
            id: "scheduled-1",
            title: "Scheduled Blog",
            excerpt: "Scheduled Excerpt",
            body: "Scheduled Body",
            isDraft: false,
            publishAt: DateTime.UtcNow.AddDays(1),
            vectorId: 4
        );

        await BlogRepository.AddAsync(publishedBlog1);
        await BlogRepository.AddAsync(publishedBlog2);
        await BlogRepository.AddAsync(draftBlog);
        await BlogRepository.AddAsync(scheduledBlog);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var publishedBlogs = await BlogRepository.GetPublishedAsync();

        // Assert
        publishedBlogs.Should().HaveCount(2);
        publishedBlogs.Should().Contain(b => b.Id == publishedBlog1.Id);
        publishedBlogs.Should().Contain(b => b.Id == publishedBlog2.Id);
        publishedBlogs.Should().NotContain(b => b.Id == draftBlog.Id);
        publishedBlogs.Should().NotContain(b => b.Id == scheduledBlog.Id);
    }
}