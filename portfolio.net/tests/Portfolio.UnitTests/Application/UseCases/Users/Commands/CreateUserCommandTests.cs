using FluentAssertions;
using Moq;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Tests.Common;
using Portfolio.Application.UseCases.Users.Commands.CreateUser;
using Portfolio.Domain.Entities;
using Portfolio.Domain.ValueObjects;
using Xunit;

namespace Portfolio.Application.Tests.UseCases.Users.Commands;

public class CreateUserCommandTests : TestBase
{
    private readonly CreateUserCommandHandler _handler;
    private readonly CreateUserCommandValidator _validator;

    public CreateUserCommandTests()
    {
        _handler = new CreateUserCommandHandler(
            MockUserRepository.Object,
            Mapper,
            ServiceProvider.GetService<Microsoft.Extensions.Logging.ILogger<CreateUserCommandHandler>>()!);

        _validator = new CreateUserCommandValidator(MockUserRepository.Object);
    }

    [Fact]
    public async Task Handle_ValidUser_ShouldCreateUserAndReturnDto()
    {
        // Arrange
        var command = new CreateUserCommand
        {
            Username = "testuser",
            Email = "test@example.com",
            DisplayName = "Test User",
            AvatarUrl = "https://example.com/avatar.jpg",
            Provider = "github",
            ProviderId = "12345",
            IsAdmin = false
        };

        var email = Email.Create(command.Email);
        var expectedUser = new User(
            id: "test-id",
            username: command.Username,
            email: email,
            displayName: command.DisplayName,
            avatarUrl: command.AvatarUrl,
            provider: command.Provider,
            providerId: command.ProviderId,
            isAdmin: command.IsAdmin
        );

        MockUserRepository
            .Setup(x => x.GetByUsernameAsync(command.Username, It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        MockUserRepository
            .Setup(x => x.GetByEmailAsync(command.Email, It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        MockUserRepository
            .Setup(x => x.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedUser);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<UserDto>();
        result.Username.Should().Be(command.Username);
        result.Email.Should().Be(command.Email);
        result.DisplayName.Should().Be(command.DisplayName);
        result.AvatarUrl.Should().Be(command.AvatarUrl);
        result.Provider.Should().Be(command.Provider);
        result.ProviderId.Should().Be(command.ProviderId);
        result.IsAdmin.Should().Be(command.IsAdmin);

        MockUserRepository.Verify(
            x => x.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_ExistingUsername_ShouldThrowValidationException()
    {
        // Arrange
        var command = new CreateUserCommand
        {
            Username = "existinguser",
            Email = "test@example.com",
            DisplayName = "Test User",
            Provider = "github",
            ProviderId = "12345"
        };

        var existingUser = new User(
            id: "existing-id",
            username: command.Username,
            email: Email.Create("existing@example.com"),
            displayName: "Existing User",
            avatarUrl: null,
            provider: "github",
            providerId: "67890",
            isAdmin: false
        );

        MockUserRepository
            .Setup(x => x.GetByUsernameAsync(command.Username, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingUser);

        // Act
        var result = await _validator.ValidateAsync(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(x => x.PropertyName == "Username");
    }

    [Fact]
    public async Task Handle_ExistingEmail_ShouldThrowValidationException()
    {
        // Arrange
        var command = new CreateUserCommand
        {
            Username = "newuser",
            Email = "existing@example.com",
            DisplayName = "Test User",
            Provider = "github",
            ProviderId = "12345"
        };

        var existingUser = new User(
            id: "existing-id",
            username: "existinguser",
            email: Email.Create(command.Email),
            displayName: "Existing User",
            avatarUrl: null,
            provider: "github",
            providerId: "67890",
            isAdmin: false
        );

        MockUserRepository
            .Setup(x => x.GetByEmailAsync(command.Email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingUser);

        // Act
        var result = await _validator.ValidateAsync(command);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(x => x.PropertyName == "Email");
    }

    [Theory]
    [InlineData("", "test@example.com", "Display Name")] // Empty username
    [InlineData("user", "", "Display Name")] // Empty email
    [InlineData("user", "invalid-email", "Display Name")] // Invalid email
    [InlineData("user", "test@example.com", "")] // Empty display name
    public async Task Validate_InvalidUser_ShouldFailValidation(string username, string email, string displayName)
    {
        // Arrange
        var command = new CreateUserCommand
        {
            Username = username,
            Email = email,
            DisplayName = displayName,
            Provider = "github",
            ProviderId = "12345"
        };

        // Act
        var result = await _validator.ValidateAsync(command);

        // Assert
        result.IsValid.Should().BeFalse();
    }
}
