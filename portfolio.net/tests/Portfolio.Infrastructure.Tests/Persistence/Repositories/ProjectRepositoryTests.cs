using FluentAssertions;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Tests.Common;
using Xunit;

namespace Portfolio.Infrastructure.Tests.Persistence.Repositories;

public class ProjectRepositoryTests : InfrastructureTestBase
{
    [Fact]
    public async Task GetByIdAsync_ExistingProject_ShouldReturnProject()
    {
        // Arrange
        var project = new Project(
            id: "test-id",
            title: "Test Project",
            description: "Test Description",
            githubUrl: "https://github.com/test/project",
            liveUrl: "https://test-project.com",
            imageUrl: "https://test-project.com/image.jpg",
            vectorId: 1
        );

        project.AddTechnology("C#");
        project.AddTechnology(".NET");

        await ProjectRepository.AddAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var result = await ProjectRepository.GetByIdAsync(project.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(project.Id);
        result.Title.Should().Be(project.Title);
        result.Description.Should().Be(project.Description);
        result.GithubUrl.Should().Be(project.GithubUrl);
        result.LiveUrl.Should().Be(project.LiveUrl);
        result.ImageUrl.Should().Be(project.ImageUrl);
        result.Technologies.Should().BeEquivalentTo(project.Technologies);
    }

    [Fact]
    public async Task GetByLinkAsync_ExistingProject_ShouldReturnProject()
    {
        // Arrange
        var project = new Project(
            id: "test-id",
            title: "Test Project",
            description: "Test Description",
            githubUrl: "https://github.com/test/project",
            liveUrl: "https://test-project.com",
            imageUrl: "https://test-project.com/image.jpg",
            vectorId: 1
        );

        await ProjectRepository.AddAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var result = await ProjectRepository.GetByLinkAsync(project.Link);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(project.Id);
        result.Link.Should().Be(project.Link);
    }

    [Fact]
    public async Task GetFeaturedAsync_ShouldReturnOnlyFeaturedProjects()
    {
        // Arrange
        var featuredProject1 = new Project(
            id: "featured-1",
            title: "Featured Project 1",
            description: "Description 1",
            githubUrl: "https://github.com/test/project1",
            liveUrl: "https://project1.com",
            imageUrl: "https://project1.com/image.jpg",
            vectorId: 1
        );
        featuredProject1.SetFeatured(true);

        var featuredProject2 = new Project(
            id: "featured-2",
            title: "Featured Project 2",
            description: "Description 2",
            githubUrl: "https://github.com/test/project2",
            liveUrl: "https://project2.com",
            imageUrl: "https://project2.com/image.jpg",
            vectorId: 2
        );
        featuredProject2.SetFeatured(true);

        var nonFeaturedProject = new Project(
            id: "non-featured",
            title: "Non Featured Project",
            description: "Description 3",
            githubUrl: "https://github.com/test/project3",
            liveUrl: "https://project3.com",
            imageUrl: "https://project3.com/image.jpg",
            vectorId: 3
        );

        await ProjectRepository.AddAsync(featuredProject1);
        await ProjectRepository.AddAsync(featuredProject2);
        await ProjectRepository.AddAsync(nonFeaturedProject);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var result = await ProjectRepository.GetFeaturedAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(p => p.Id == featuredProject1.Id);
        result.Should().Contain(p => p.Id == featuredProject2.Id);
    }

    [Fact]
    public async Task AddAsync_ValidProject_ShouldAddAndGenerateId()
    {
        // Arrange
        var project = new Project(
            id: "test-id",
            title: "Test Project",
            description: "Test Description",
            githubUrl: "https://github.com/test/project",
            liveUrl: "https://test-project.com",
            imageUrl: "https://test-project.com/image.jpg",
            vectorId: 1
        );

        // Act
        var result = await ProjectRepository.AddAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(project.Id);

        var savedProject = await ProjectRepository.GetByIdAsync(project.Id);
        savedProject.Should().NotBeNull();
        savedProject!.Title.Should().Be(project.Title);
    }

    [Fact]
    public async Task UpdateAsync_ExistingProject_ShouldUpdateProperties()
    {
        // Arrange
        var project = new Project(
            id: "test-id",
            title: "Test Project",
            description: "Test Description",
            githubUrl: "https://github.com/test/project",
            liveUrl: "https://test-project.com",
            imageUrl: "https://test-project.com/image.jpg",
            vectorId: 1
        );

        await ProjectRepository.AddAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Act
        project.UpdateTitle("Updated Title");
        project.UpdateDescription("Updated Description");
        project.UpdateGithubUrl("https://github.com/test/updated-project");
        project.UpdateLiveUrl("https://updated-project.com");
        project.UpdateImageUrl("https://updated-project.com/image.jpg");
        project.SetFeatured(true);

        await ProjectRepository.UpdateAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        var updatedProject = await ProjectRepository.GetByIdAsync(project.Id);
        updatedProject.Should().NotBeNull();
        updatedProject!.Title.Should().Be("Updated Title");
        updatedProject.Description.Should().Be("Updated Description");
        updatedProject.GithubUrl.Should().Be("https://github.com/test/updated-project");
        updatedProject.LiveUrl.Should().Be("https://updated-project.com");
        updatedProject.ImageUrl.Should().Be("https://updated-project.com/image.jpg");
        updatedProject.IsFeatured.Should().BeTrue();
    }

    [Fact]
    public async Task DeleteAsync_ExistingProject_ShouldRemoveProject()
    {
        // Arrange
        var project = new Project(
            id: "test-id",
            title: "Test Project",
            description: "Test Description",
            githubUrl: "https://github.com/test/project",
            liveUrl: "https://test-project.com",
            imageUrl: "https://test-project.com/image.jpg",
            vectorId: 1
        );

        await ProjectRepository.AddAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Act
        await ProjectRepository.DeleteAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        var deletedProject = await ProjectRepository.GetByIdAsync(project.Id);
        deletedProject.Should().BeNull();
    }

    [Fact]
    public async Task GetNextVectorIdAsync_ShouldReturnIncrementedId()
    {
        // Arrange
        var project1 = new Project(
            id: "test-1",
            title: "Test Project 1",
            description: "Description 1",
            githubUrl: "https://github.com/test/project1",
            liveUrl: "https://project1.com",
            imageUrl: "https://project1.com/image.jpg",
            vectorId: 1
        );

        var project2 = new Project(
            id: "test-2",
            title: "Test Project 2",
            description: "Description 2",
            githubUrl: "https://github.com/test/project2",
            liveUrl: "https://project2.com",
            imageUrl: "https://project2.com/image.jpg",
            vectorId: 2
        );

        await ProjectRepository.AddAsync(project1);
        await ProjectRepository.AddAsync(project2);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var nextVectorId = await ProjectRepository.GetNextVectorIdAsync();

        // Assert
        nextVectorId.Should().Be(3);
    }
}
