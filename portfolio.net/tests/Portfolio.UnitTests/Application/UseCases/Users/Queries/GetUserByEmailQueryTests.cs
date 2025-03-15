using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Tests.Common;
using Portfolio.Application.UseCases.Users.Queries.GetUserByEmail;
using Portfolio.Domain.Entities;
using Portfolio.Domain.ValueObjects;
using Xunit;

namespace Portfolio.Application.Tests.UseCases.Users.Queries;

public class GetUserByEmailQueryTests : TestBase
{
    private readonly GetUserByEmailQueryHandler _handler;

    public GetUserByEmailQueryTests()
    {
        _handler = new GetUserByEmailQueryHandler(
            MockUserRepository.Object,
            Mapper,
            ServiceProvider.GetService<Microsoft.Extensions.Logging.ILogger<GetUserByEmailQueryHandler>>()!);
    }

    [Fact]
    public async Task Handle_ExistingUser_ShouldReturnUserDto()
    {
        // Arrange
        var email = "test@example.com";
        var user = new User(
            id: "test-id",
            username: "testuser",
            email: Email.Create(email),
            displayName: "Test User",
            avatarUrl: "https://example.com/avatar.jpg",
            provider: "github",
            providerId: "12345",
            isAdmin: false
        );

        MockUserRepository
            .Setup(x => x.GetByEmailAsync(email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var query = new GetUserByEmailQuery { Email = email };

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
            x => x.GetByEmailAsync(email, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_NonExistingUser_ShouldReturnNull()
    {
        // Arrange
        var email = "nonexisting@example.com";

        MockUserRepository
            .Setup(x => x.GetByEmailAsync(email, It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        var query = new GetUserByEmailQuery { Email = email };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().BeNull();

        MockUserRepository.Verify(
            x => x.GetByEmailAsync(email, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Theory]
    [InlineData("")]
    [InlineData("invalid-email")]
    [InlineData("invalid@")]
    [InlineData("@invalid.com")]
    public async Task Handle_InvalidEmail_ShouldReturnNull(string invalidEmail)
    {
        // Arrange
        var query = new GetUserByEmailQuery { Email = invalidEmail };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().BeNull();
        MockUserRepository.Verify(
            x => x.GetByEmailAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_RepositoryThrowsException_ShouldPropagateException()
    {
        // Arrange
        var email = "test@example.com";
        var expectedException = new Exception("Test exception");

        MockUserRepository
            .Setup(x => x.GetByEmailAsync(email, It.IsAny<CancellationToken>()))
            .ThrowsAsync(expectedException);

        var query = new GetUserByEmailQuery { Email = email };

        // Act
        var act = () => _handler.Handle(query, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<Exception>()
            .WithMessage(expectedException.Message);

        MockUserRepository.Verify(
            x => x.GetByEmailAsync(email, It.IsAny<CancellationToken>()),
            Times.Once);
    }
}
