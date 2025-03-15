using FluentAssertions;
using Portfolio.Domain.Entities;
using Xunit;

namespace Portfolio.UnitTests.Infrastructure.Persistence.Repositories;

public class BaseRepositoryTests : TestDbContext
{
    [Fact]
    public async Task GetByIdAsync_ExistingEntity_ShouldReturnEntity()
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
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingEntity_ShouldReturnNull()
    {
        // Act
        var result = await BlogRepository.GetByIdAsync("non-existing-id");

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetAllAsync_MultipleEntities_ShouldReturnAllEntities()
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
        var results = await BlogRepository.GetAllAsync();

        // Assert
        var blogs = results.ToList();
        blogs.Should().HaveCount(2);
        blogs.Should().Contain(b => b.Id == blog1.Id);
        blogs.Should().Contain(b => b.Id == blog2.Id);
    }

    [Fact]
    public async Task AddAsync_ValidEntity_ShouldAddToDatabase()
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
        await BlogRepository.AddAsync(blog);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        var savedBlog = await BlogRepository.GetByIdAsync(blog.Id);
        savedBlog.Should().NotBeNull();
        savedBlog!.Id.Should().Be(blog.Id);
    }

    [Fact]
    public async Task UpdateAsync_ExistingEntity_ShouldUpdateInDatabase()
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
        blog.UpdateTitle("Updated Title");
        await BlogRepository.UpdateAsync(blog);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        var updatedBlog = await BlogRepository.GetByIdAsync(blog.Id);
        updatedBlog.Should().NotBeNull();
        updatedBlog!.Title.Should().Be("Updated Title");
    }

    [Fact]
    public async Task DeleteAsync_ExistingEntity_ShouldRemoveFromDatabase()
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
        await BlogRepository.DeleteAsync(blog.Id);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        var deletedBlog = await BlogRepository.GetByIdAsync(blog.Id);
        deletedBlog.Should().BeNull();
    }

    [Fact]
    public async Task DeleteAsync_NonExistingEntity_ShouldNotThrowException()
    {
        // Act & Assert
        await BlogRepository.Invoking(r => r.DeleteAsync("non-existing-id"))
            .Should().NotThrowAsync();
    }
}
