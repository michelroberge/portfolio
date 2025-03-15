using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Tests.Common;
using Portfolio.Application.UseCases.Users.Queries.GetUserByUsername;
using Portfolio.Domain.Entities;
using Portfolio.Domain.ValueObjects;
using Xunit;

namespace Portfolio.Application.Tests.UseCases.Users.Queries;

public class GetUserByUsernameQueryTests : TestBase
{
    private readonly GetUserByUsernameQueryHandler _handler;

    public GetUserByUsernameQueryTests()
    {
        _handler = new GetUserByUsernameQueryHandler(
            MockUserRepository.Object,
            Mapper,
            ServiceProvider.GetService<Microsoft.Extensions.Logging.ILogger<GetUserByUsernameQueryHandler>>()!);
    }

    [Fact]
    public async Task Handle_ExistingUser_ShouldReturnUserDto()
    {
        // Arrange
        var username = "testuser";
        var user = new User(
            id: "test-id",
            username: username,
            email: Email.Create("test@example.com"),
            displayName: "Test User",
            avatarUrl: "https://example.com/avatar.jpg",
            provider: "github",
            providerId: "12345",
            isAdmin: false
        );

        MockUserRepository
            .Setup(x => x.GetByUsernameAsync(username, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var query = new GetUserByUsernameQuery { Username = username };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<UserDto>();
        result!.Username.Should().Be(user.Username);
        result.Email.Should().Be(user.Email.Value);
        result.DisplayName.Should().Be(user.DisplayName);
        result.AvatarUrl.Should().Be(user.AvatarUrl);
        result.Provider.Should().Be(user.Provider);
        result.ProviderId.Should().Be(user.ProviderId);
        result.IsAdmin.Should().Be(user.IsAdmin);

        MockUserRepository.Verify(
            x => x.GetByUsernameAsync(username, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_NonExistingUser_ShouldReturnNull()
    {
        // Arrange
        var username = "nonexistinguser";

        MockUserRepository
            .Setup(x => x.GetByUsernameAsync(username, It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        var query = new GetUserByUsernameQuery { Username = username };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().BeNull();

        MockUserRepository.Verify(
            x => x.GetByUsernameAsync(username, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_RepositoryThrowsException_ShouldPropagateException()
    {
        // Arrange
        var username = "testuser";
        var expectedException = new Exception("Test exception");

        MockUserRepository
            .Setup(x => x.GetByUsernameAsync(username, It.IsAny<CancellationToken>()))
            .ThrowsAsync(expectedException);

        var query = new GetUserByUsernameQuery { Username = username };

        // Act
        var act = () => _handler.Handle(query, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<Exception>()
            .WithMessage(expectedException.Message);

        MockUserRepository.Verify(
            x => x.GetByUsernameAsync(username, It.IsAny<CancellationToken>()),
            Times.Once);
    }
}
