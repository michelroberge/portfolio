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
    private readonly Email ValidEmail = Email.Create("test@example.com");
    private const string ValidDisplayName = "Test User";
    private const string ValidAvatarUrl = "https://example.com/avatar.jpg";
    private const string ValidProvider = "github";
    private const string ValidProviderId = "12345";

    [Fact]
    public void Constructor_WithValidParameters_CreatesInstance()
    {
        // Arrange & Act
        var user = new User(ValidId, ValidUsername, ValidEmail, ValidDisplayName, ValidAvatarUrl, ValidProvider, ValidProviderId);

        // Assert
        user.Should().NotBeNull();
        user.Id.Should().Be(ValidId);
        user.Username.Should().Be(ValidUsername);
        user.Email.Should().Be(ValidEmail);
        user.DisplayName.Should().Be(ValidDisplayName);
        user.AvatarUrl.Should().Be(ValidAvatarUrl);
        user.Provider.Should().Be(ValidProvider);
        user.ProviderId.Should().Be(ValidProviderId);
        user.IsAdmin.Should().BeFalse();
        user.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidUsername_ThrowsDomainValidationException(string invalidUsername)
    {
        // Arrange & Act
        var action = () => new User(ValidId, invalidUsername, ValidEmail);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Username cannot be empty");
    }

    [Theory]
    [InlineData("ab")]
    public void Constructor_WithUsernameTooShort_ThrowsDomainValidationException(string shortUsername)
    {
        // Arrange & Act
        var action = () => new User(ValidId, shortUsername, ValidEmail);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Username must be at least 3 characters long");
    }

    [Fact]
    public void Constructor_WithUsernameTooLong_ThrowsDomainValidationException()
    {
        // Arrange
        var longUsername = new string('a', 51);

        // Act
        var action = () => new User(ValidId, longUsername, ValidEmail);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Username cannot be longer than 50 characters");
    }

    [Theory]
    [InlineData("user@name")]
    [InlineData("user name")]
    [InlineData("user#name")]
    [InlineData("user$name")]
    public void Constructor_WithInvalidUsernameCharacters_ThrowsDomainValidationException(string invalidUsername)
    {
        // Arrange & Act
        var action = () => new User(ValidId, invalidUsername, ValidEmail);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Username can only contain letters, numbers, dots, and underscores");
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("ftp://invalid-scheme.com")]
    public void Constructor_WithInvalidAvatarUrl_ThrowsDomainValidationException(string invalidUrl)
    {
        // Arrange & Act
        var action = () => new User(ValidId, ValidUsername, ValidEmail, avatarUrl: invalidUrl);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("avatarUrl must be a valid HTTP/HTTPS URL");
    }

    [Fact]
    public void Constructor_WithProviderWithoutProviderId_ThrowsDomainValidationException()
    {
        // Arrange & Act
        var action = () => new User(ValidId, ValidUsername, ValidEmail, provider: ValidProvider);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Provider and ProviderId must both be either null or non-null");
    }

    [Fact]
    public void Constructor_WithProviderIdWithoutProvider_ThrowsDomainValidationException()
    {
        // Arrange & Act
        var action = () => new User(ValidId, ValidUsername, ValidEmail, providerId: ValidProviderId);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Provider and ProviderId must both be either null or non-null");
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    public void Constructor_WithEmptyProvider_ThrowsDomainValidationException(string emptyProvider)
    {
        // Arrange & Act
        var action = () => new User(ValidId, ValidUsername, ValidEmail, provider: emptyProvider, providerId: ValidProviderId);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Provider cannot be empty when specified");
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    public void Constructor_WithEmptyProviderId_ThrowsDomainValidationException(string emptyProviderId)
    {
        // Arrange & Act
        var action = () => new User(ValidId, ValidUsername, ValidEmail, provider: ValidProvider, providerId: emptyProviderId);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("ProviderId cannot be empty when provider is specified");
    }

    [Fact]
    public void UpdateDisplayName_WithValidName_UpdatesDisplayName()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail);
        var newDisplayName = "New Display Name";

        // Act
        user.UpdateDisplayName(newDisplayName);

        // Assert
        user.DisplayName.Should().Be(newDisplayName);
        user.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UpdateDisplayName_WithNullName_ClearsDisplayName()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail, ValidDisplayName);

        // Act
        user.UpdateDisplayName(null);

        // Assert
        user.DisplayName.Should().BeNull();
        user.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UpdateDisplayName_WithTooLongName_ThrowsDomainValidationException()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail);
        var longDisplayName = new string('a', 101);

        // Act
        var action = () => user.UpdateDisplayName(longDisplayName);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Display name cannot be longer than 100 characters");
    }

    [Fact]
    public void UpdateAvatarUrl_WithValidUrl_UpdatesAvatarUrl()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail);
        var newAvatarUrl = "https://example.com/new-avatar.jpg";

        // Act
        user.UpdateAvatarUrl(newAvatarUrl);

        // Assert
        user.AvatarUrl.Should().Be(newAvatarUrl);
        user.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UpdateAvatarUrl_WithNullUrl_ClearsAvatarUrl()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail, avatarUrl: ValidAvatarUrl);

        // Act
        user.UpdateAvatarUrl(null);

        // Assert
        user.AvatarUrl.Should().BeNull();
        user.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UpdateProvider_WithValidInfo_UpdatesProviderInfo()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail);
        var newProvider = "google";
        var newProviderId = "67890";

        // Act
        user.UpdateProvider(newProvider, newProviderId);

        // Assert
        user.Provider.Should().Be(newProvider);
        user.ProviderId.Should().Be(newProviderId);
        user.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void UpdateProvider_WithNullInfo_ClearsProviderInfo()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail, provider: ValidProvider, providerId: ValidProviderId);

        // Act
        user.UpdateProvider(null, null);

        // Assert
        user.Provider.Should().BeNull();
        user.ProviderId.Should().BeNull();
        user.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void MakeAdmin_SetsIsAdminToTrue()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail);
        user.IsAdmin.Should().BeFalse();

        // Act
        user.MakeAdmin();

        // Assert
        user.IsAdmin.Should().BeTrue();
        user.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void RemoveAdmin_SetsIsAdminToFalse()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail);
        user.MakeAdmin();
        user.IsAdmin.Should().BeTrue();

        // Act
        user.RemoveAdmin();

        // Assert
        user.IsAdmin.Should().BeFalse();
        user.ModifiedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }
}
