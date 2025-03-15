using AutoMapper;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Mappings;
using Portfolio.Domain.Entities;
using Portfolio.Domain.ValueObjects;
using Xunit;

namespace Portfolio.Application.Tests.Common.Mappings;

public class MappingTests
{
    private readonly IConfigurationProvider _configuration;
    private readonly IMapper _mapper;

    public MappingTests()
    {
        _configuration = new MapperConfiguration(config =>
            config.AddProfile<MappingProfile>());

        _mapper = _configuration.CreateMapper();
    }

    [Fact]
    public void ShouldHaveValidConfiguration()
    {
        _configuration.AssertConfigurationIsValid();
    }

    [Fact]
    public void ShouldMapBlogToBlogDto()
    {
        // Arrange
        var blog = new Blog(
            id: "test-id",
            title: "Test Blog",
            excerpt: "Test Excerpt",
            body: "Test Body",
            isDraft: false,
            publishAt: DateTime.UtcNow,
            vectorId: 1
        );

        blog.AddTag("test");
        blog.AddTag("blog");

        // Act
        var dto = _mapper.Map<BlogDto>(blog);

        // Assert
        Assert.NotNull(dto);
        Assert.Equal(blog.Id, dto.Id);
        Assert.Equal(blog.Title, dto.Title);
        Assert.Equal(blog.Excerpt, dto.Excerpt);
        Assert.Equal(blog.Body, dto.Body);
        Assert.Equal(blog.IsDraft, dto.IsDraft);
        Assert.Equal(blog.PublishAt, dto.PublishAt);
        Assert.Equal(blog.CreatedAt, dto.CreatedAt);
        Assert.Equal(blog.UpdatedAt, dto.UpdatedAt);
        Assert.Equal(blog.Tags, dto.Tags);
    }

    [Fact]
    public void ShouldMapProjectToProjectDto()
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

        // Act
        var dto = _mapper.Map<ProjectDto>(project);

        // Assert
        Assert.NotNull(dto);
        Assert.Equal(project.Id, dto.Id);
        Assert.Equal(project.Title, dto.Title);
        Assert.Equal(project.Description, dto.Description);
        Assert.Equal(project.GithubUrl, dto.GithubUrl);
        Assert.Equal(project.LiveUrl, dto.LiveUrl);
        Assert.Equal(project.ImageUrl, dto.ImageUrl);
        Assert.Equal(project.CreatedAt, dto.CreatedAt);
        Assert.Equal(project.UpdatedAt, dto.UpdatedAt);
        Assert.Equal(project.Technologies, dto.Technologies);
    }

    [Fact]
    public void ShouldMapUserToUserDto()
    {
        // Arrange
        var user = new User(
            id: "test-id",
            username: "testuser",
            email: Email.Create("test@example.com"),
            displayName: "Test User",
            avatarUrl: "https://example.com/avatar.jpg",
            provider: "github",
            providerId: "12345",
            isAdmin: false
        );

        // Act
        var dto = _mapper.Map<UserDto>(user);

        // Assert
        Assert.NotNull(dto);
        Assert.Equal(user.Id, dto.Id);
        Assert.Equal(user.Username, dto.Username);
        Assert.Equal(user.Email.Value, dto.Email);
        Assert.Equal(user.DisplayName, dto.DisplayName);
        Assert.Equal(user.AvatarUrl, dto.AvatarUrl);
        Assert.Equal(user.Provider, dto.Provider);
        Assert.Equal(user.ProviderId, dto.ProviderId);
        Assert.Equal(user.IsAdmin, dto.IsAdmin);
        Assert.Equal(user.CreatedAt, dto.CreatedAt);
        Assert.Equal(user.UpdatedAt, dto.UpdatedAt);
    }

    [Fact]
    public void ShouldHandleNullValues()
    {
        // Arrange
        var user = new User(
            id: "test-id",
            username: "testuser",
            email: Email.Create("test@example.com"),
            displayName: "Test User",
            avatarUrl: null,
            provider: "github",
            providerId: "12345",
            isAdmin: false
        );

        var project = new Project(
            id: "test-id",
            title: "Test Project",
            description: "Test Description",
            githubUrl: null,
            liveUrl: null,
            imageUrl: null,
            vectorId: 1
        );

        // Act
        var userDto = _mapper.Map<UserDto>(user);
        var projectDto = _mapper.Map<ProjectDto>(project);

        // Assert
        Assert.Null(userDto.AvatarUrl);
        Assert.Null(projectDto.GithubUrl);
        Assert.Null(projectDto.LiveUrl);
        Assert.Null(projectDto.ImageUrl);
    }
}
