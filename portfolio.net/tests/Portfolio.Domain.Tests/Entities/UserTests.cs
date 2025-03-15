using Portfolio.Domain.Entities;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.ValueObjects;

namespace Portfolio.Domain.Tests.Entities;

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
        Assert.NotNull(user);
        Assert.Equal(ValidId, user.Id);
        Assert.Equal(ValidUsername, user.Username);
        Assert.Equal(ValidEmail, user.Email);
        Assert.Equal(ValidDisplayName, user.DisplayName);
        Assert.Equal(ValidAvatarUrl, user.AvatarUrl);
        Assert.Equal(ValidProvider, user.Provider);
        Assert.Equal(ValidProviderId, user.ProviderId);
        Assert.False(user.IsAdmin);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Constructor_WithInvalidUsername_ThrowsDomainValidationException(string invalidUsername)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new User(ValidId, invalidUsername, ValidEmail));
        Assert.Equal("Username cannot be empty", exception.Message);
    }

    [Theory]
    [InlineData("ab")]
    public void Constructor_WithUsernameTooShort_ThrowsDomainValidationException(string shortUsername)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new User(ValidId, shortUsername, ValidEmail));
        Assert.Equal("Username must be at least 3 characters long", exception.Message);
    }

    [Fact]
    public void Constructor_WithUsernameTooLong_ThrowsDomainValidationException()
    {
        // Arrange
        var longUsername = new string('a', 51);

        // Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new User(ValidId, longUsername, ValidEmail));
        Assert.Equal("Username cannot be longer than 50 characters", exception.Message);
    }

    [Theory]
    [InlineData("user@name")]
    [InlineData("user name")]
    [InlineData("user#name")]
    [InlineData("user$name")]
    public void Constructor_WithInvalidUsernameCharacters_ThrowsDomainValidationException(string invalidUsername)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new User(ValidId, invalidUsername, ValidEmail));
        Assert.Equal("Username can only contain letters, numbers, dots, and underscores", exception.Message);
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("ftp://invalid-scheme.com")]
    public void Constructor_WithInvalidAvatarUrl_ThrowsDomainValidationException(string invalidUrl)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new User(ValidId, ValidUsername, ValidEmail, avatarUrl: invalidUrl));
        Assert.Equal("avatarUrl must be a valid HTTP/HTTPS URL", exception.Message);
    }

    [Fact]
    public void Constructor_WithProviderWithoutProviderId_ThrowsDomainValidationException()
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new User(ValidId, ValidUsername, ValidEmail, provider: ValidProvider));
        Assert.Equal("Provider and ProviderId must both be either null or non-null", exception.Message);
    }

    [Fact]
    public void Constructor_WithProviderIdWithoutProvider_ThrowsDomainValidationException()
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new User(ValidId, ValidUsername, ValidEmail, providerId: ValidProviderId));
        Assert.Equal("Provider and ProviderId must both be either null or non-null", exception.Message);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    public void Constructor_WithEmptyProvider_ThrowsDomainValidationException(string emptyProvider)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new User(ValidId, ValidUsername, ValidEmail, provider: emptyProvider, providerId: ValidProviderId));
        Assert.Equal("Provider cannot be empty when specified", exception.Message);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    public void Constructor_WithEmptyProviderId_ThrowsDomainValidationException(string emptyProviderId)
    {
        // Arrange & Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            new User(ValidId, ValidUsername, ValidEmail, provider: ValidProvider, providerId: emptyProviderId));
        Assert.Equal("ProviderId cannot be empty when provider is specified", exception.Message);
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
        Assert.Equal(newDisplayName, user.DisplayName);
    }

    [Fact]
    public void UpdateDisplayName_WithNullName_ClearsDisplayName()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail, ValidDisplayName);

        // Act
        user.UpdateDisplayName(null);

        // Assert
        Assert.Null(user.DisplayName);
    }

    [Fact]
    public void UpdateDisplayName_WithTooLongName_ThrowsDomainValidationException()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail);
        var longDisplayName = new string('a', 101);

        // Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() =>
            user.UpdateDisplayName(longDisplayName));
        Assert.Equal("Display name cannot be longer than 100 characters", exception.Message);
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
        Assert.Equal(newAvatarUrl, user.AvatarUrl);
    }

    [Fact]
    public void UpdateAvatarUrl_WithNullUrl_ClearsAvatarUrl()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail, avatarUrl: ValidAvatarUrl);

        // Act
        user.UpdateAvatarUrl(null);

        // Assert
        Assert.Null(user.AvatarUrl);
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
        Assert.Equal(newProvider, user.Provider);
        Assert.Equal(newProviderId, user.ProviderId);
    }

    [Fact]
    public void UpdateProvider_WithNullInfo_ClearsProviderInfo()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail, provider: ValidProvider, providerId: ValidProviderId);

        // Act
        user.UpdateProvider(null, null);

        // Assert
        Assert.Null(user.Provider);
        Assert.Null(user.ProviderId);
    }

    [Fact]
    public void SetAdminStatus_UpdatesIsAdmin()
    {
        // Arrange
        var user = new User(ValidId, ValidUsername, ValidEmail);
        Assert.False(user.IsAdmin); // Default value

        // Act
        user.SetAdminStatus(true);

        // Assert
        Assert.True(user.IsAdmin);
    }
}
