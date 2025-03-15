using FluentAssertions;
using Portfolio.Domain.Entities;
using Xunit;

namespace Portfolio.UnitTests.Infrastructure.Persistence.Repositories;

public class ProjectRepositoryTests : TestDbContext
{
    [Fact]
    public async Task GetByIdAsync_ExistingProject_ShouldReturnProject()
    {
        // Arrange
        var project = new Project(
            id: "test-id",
            title: "Test Project",
            description: "Test Description",
            link: "test-link",
            githubUrl: "https://github.com/test",
            isDraft: false,
            vectorId: 1
        );

        await ProjectRepository.AddAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var result = await ProjectRepository.GetByIdAsync(project.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(project.Id);
        result.Title.Should().Be(project.Title);
    }

    [Fact]
    public async Task GetByLinkAsync_ExistingProject_ShouldReturnProject()
    {
        // Arrange
        var project = new Project(
            id: "test-id",
            title: "Test Project",
            description: "Test Description",
            link: "test-link",
            githubUrl: "https://github.com/test",
            isDraft: false,
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
    public async Task GetByTechnologyAsync_ExistingProjects_ShouldReturnMatchingProjects()
    {
        // Arrange
        var project1 = new Project(
            id: "test-1",
            title: "Project 1",
            description: "Description 1",
            link: "link-1",
            githubUrl: "https://github.com/test1",
            isDraft: false,
            vectorId: 1
        );
        project1.AddTechnology("dotnet");
        project1.AddTechnology("react");

        var project2 = new Project(
            id: "test-2",
            title: "Project 2",
            description: "Description 2",
            link: "link-2",
            githubUrl: "https://github.com/test2",
            isDraft: false,
            vectorId: 2
        );
        project2.AddTechnology("dotnet");
        project2.AddTechnology("angular");

        var project3 = new Project(
            id: "test-3",
            title: "Project 3",
            description: "Description 3",
            link: "link-3",
            githubUrl: "https://github.com/test3",
            isDraft: false,
            vectorId: 3
        );
        project3.AddTechnology("nodejs");
        project3.AddTechnology("react");

        await ProjectRepository.AddAsync(project1);
        await ProjectRepository.AddAsync(project2);
        await ProjectRepository.AddAsync(project3);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var dotnetProjects = await ProjectRepository.GetByTechnologyAsync("dotnet");
        var reactProjects = await ProjectRepository.GetByTechnologyAsync("react");
        var angularProjects = await ProjectRepository.GetByTechnologyAsync("angular");
        var vueProjects = await ProjectRepository.GetByTechnologyAsync("vue");

        // Assert
        dotnetProjects.Should().HaveCount(2);
        dotnetProjects.Should().Contain(p => p.Id == project1.Id);
        dotnetProjects.Should().Contain(p => p.Id == project2.Id);

        reactProjects.Should().HaveCount(2);
        reactProjects.Should().Contain(p => p.Id == project1.Id);
        reactProjects.Should().Contain(p => p.Id == project3.Id);

        angularProjects.Should().HaveCount(1);
        angularProjects.Should().Contain(p => p.Id == project2.Id);

        vueProjects.Should().BeEmpty();
    }

    [Fact]
    public async Task GetNextVectorIdAsync_MultipleProjects_ShouldReturnNextId()
    {
        // Arrange
        var project1 = new Project(
            id: "test-1",
            title: "Project 1",
            description: "Description 1",
            link: "link-1",
            githubUrl: "https://github.com/test1",
            isDraft: false,
            vectorId: 1
        );

        var project2 = new Project(
            id: "test-2",
            title: "Project 2",
            description: "Description 2",
            link: "link-2",
            githubUrl: "https://github.com/test2",
            isDraft: false,
            vectorId: 5
        );

        await ProjectRepository.AddAsync(project1);
        await ProjectRepository.AddAsync(project2);
        await UnitOfWork.SaveChangesAsync();

        // Act
        var nextVectorId = await ProjectRepository.GetNextVectorIdAsync();

        // Assert
        nextVectorId.Should().Be(6);
    }

    [Fact]
    public async Task GetNextVectorIdAsync_NoProjects_ShouldReturnOne()
    {
        // Act
        var nextVectorId = await ProjectRepository.GetNextVectorIdAsync();

        // Assert
        nextVectorId.Should().Be(1);
    }

    [Fact]
    public async Task AddAsync_ValidProject_ShouldGenerateLink()
    {
        // Arrange
        var project = new Project(
            id: "test-id",
            title: "Test Project Title",
            description: "Test Description",
            link: "test-link",
            githubUrl: "https://github.com/test",
            isDraft: false,
            vectorId: 1
        );

        // Act
        await ProjectRepository.AddAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        var savedProject = await ProjectRepository.GetByIdAsync(project.Id);
        savedProject.Should().NotBeNull();
        savedProject!.Link.Should().Be("test-link");
    }

    [Fact]
    public async Task UpdateAsync_ChangingTitle_ShouldUpdateLink()
    {
        // Arrange
        var project = new Project(
            id: "test-id",
            title: "Original Title",
            description: "Test Description",
            link: "original-link",
            githubUrl: "https://github.com/test",
            isDraft: false,
            vectorId: 1
        );

        await ProjectRepository.AddAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Act
        project.UpdateTitle("Updated Title");
        await ProjectRepository.UpdateAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        var updatedProject = await ProjectRepository.GetByIdAsync(project.Id);
        updatedProject.Should().NotBeNull();
        updatedProject!.Title.Should().Be("Updated Title");
        updatedProject.Link.Should().Be("updated-link");
    }

    [Fact]
    public async Task UpdateAsync_AddingTechnologies_ShouldPersistChanges()
    {
        // Arrange
        var project = new Project(
            id: "test-id",
            title: "Test Project",
            description: "Test Description",
            link: "test-link",
            githubUrl: "https://github.com/test",
            isDraft: false,
            vectorId: 1
        );

        await ProjectRepository.AddAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Act
        project.AddTechnology("dotnet");
        project.AddTechnology("react");
        await ProjectRepository.UpdateAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        var updatedProject = await ProjectRepository.GetByIdAsync(project.Id);
        updatedProject.Should().NotBeNull();
        updatedProject!.Technologies.Should().HaveCount(2);
        updatedProject.Technologies.Should().Contain("dotnet");
        updatedProject.Technologies.Should().Contain("react");
    }

    [Fact]
    public async Task DeleteAsync_ExistingProject_ShouldRemoveFromDatabase()
    {
        // Arrange
        var project = new Project(
            id: "test-id",
            title: "Test Project",
            description: "Test Description",
            link: "test-link",
            githubUrl: "https://github.com/test",
            isDraft: false,
            vectorId: 1
        );

        await ProjectRepository.AddAsync(project);
        await UnitOfWork.SaveChangesAsync();

        // Act
        await ProjectRepository.DeleteAsync(project.Id);
        await UnitOfWork.SaveChangesAsync();

        // Assert
        var deletedProject = await ProjectRepository.GetByIdAsync(project.Id);
        deletedProject.Should().BeNull();
    }
}
