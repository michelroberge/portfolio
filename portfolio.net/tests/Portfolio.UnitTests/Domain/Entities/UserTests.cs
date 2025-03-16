using FluentAssertions;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.ValueObjects;
using Xunit;

namespace Portfolio.UnitTests.Domain.Entities;

public class UserTests
{
    private const string ValidId = "test-id";
    private const string ValidUsername = "testuser";
    private const string ValidDisplayName = "Test User";
    private const string ValidAvatarUrl = "https://example.com/avatar.jpg";
    private static readonly Email ValidEmail = Email.Create("test@example.com");

    [Fact]
    public void Constructor_WithValidParameters_CreatesInstance()
    {
        // Arrange & Act
        var user = new User(
            id: ValidId,
            username: ValidUsername,
            email: ValidEmail,
            displayName: ValidDisplayName,
            avatarUrl: ValidAvatarUrl,
            provider: "github",
            providerId: "12345",
            isAdmin: true
        );

        // Assert
        user.Should().NotBeNull();
        user.Id.Should().Be(ValidId);
        user.Username.Should().Be(ValidUsername);
        user.Email.Should().Be(ValidEmail);
        user.DisplayName.Should().Be(ValidDisplayName);
        user.AvatarUrl.Should().Be(ValidAvatarUrl);
        user.Provider.Should().Be("github");
        user.ProviderId.Should().Be("12345");
        user.IsAdmin.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidUsername_ThrowsDomainValidationException(string invalidUsername)
    {
        // Arrange & Act
        var user = new User(ValidId);
        var action = () => user.Username = invalidUsername;

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Username cannot be empty");
    }

    [Theory]
    [InlineData("ab")]
    public void Constructor_WithTooShortUsername_ThrowsDomainValidationException(string shortUsername)
    {
        // Arrange & Act
        var user = new User(ValidId);
        var action = () => user.Username = shortUsername;

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Username must be at least 3 characters long");
    }

    [Theory]
    [InlineData("a".PadRight(51, 'a'))]
    public void Constructor_WithTooLongUsername_ThrowsDomainValidationException(string longUsername)
    {
        // Arrange & Act
        var user = new User(ValidId);
        var action = () => user.Username = longUsername;

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Username cannot be longer than 50 characters");
    }

    [Theory]
    [InlineData("user@name")]
    [InlineData("user#name")]
    [InlineData("user$name")]
    public void Constructor_WithInvalidUsernameCharacters_ThrowsDomainValidationException(string invalidUsername)
    {
        // Arrange & Act
        var user = new User(ValidId);
        var action = () => user.Username = invalidUsername;

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Username can only contain letters, numbers, dots, and underscores");
    }

    [Theory]
    [InlineData("a".PadRight(101, 'a'))]
    public void Constructor_WithTooLongDisplayName_ThrowsDomainValidationException(string longDisplayName)
    {
        // Arrange & Act
        var user = new User(ValidId);
        var action = () => user.DisplayName = longDisplayName;

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Display name cannot be longer than 100 characters");
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("ftp://invalid-scheme.com")]
    public void Constructor_WithInvalidAvatarUrl_ThrowsDomainValidationException(string invalidUrl)
    {
        // Arrange & Act
        var user = new User(ValidId);
        var action = () => user.AvatarUrl = invalidUrl;

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("AvatarUrl must be a valid HTTP/HTTPS URL");
    }

    [Fact]
    public void Constructor_WithNullId_UsesEmptyString()
    {
        // Arrange & Act
        var user = new User();

        // Assert
        user.Id.Should().NotBeNull();
        user.Id.Should().BeEmpty();
        user.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        user.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }
}
