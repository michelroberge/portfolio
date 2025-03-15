using Portfolio.Domain.Exceptions;
using Portfolio.Domain.ValueObjects;

namespace Portfolio.Domain.Tests.ValueObjects;

public class EmailTests
{
    [Theory]
    [InlineData("test@example.com")]
    [InlineData("user.name@domain.co.uk")]
    [InlineData("user+label@domain.com")]
    public void Create_WithValidEmail_CreatesInstance(string validEmail)
    {
        // Act
        var email = Email.Create(validEmail);

        // Assert
        Assert.NotNull(email);
        Assert.Equal(validEmail.ToLowerInvariant(), email.Value);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Create_WithEmptyEmail_ThrowsDomainValidationException(string invalidEmail)
    {
        // Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() => Email.Create(invalidEmail));
        Assert.Equal("Email cannot be empty", exception.Message);
    }

    [Theory]
    [InlineData("notanemail")]
    [InlineData("@nodomain")]
    [InlineData("missing@")]
    [InlineData("missing@.com")]
    [InlineData("@missing.domain")]
    [InlineData("spaces in@domain.com")]
    public void Create_WithInvalidFormat_ThrowsDomainValidationException(string invalidEmail)
    {
        // Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() => Email.Create(invalidEmail));
        Assert.Equal("Invalid email format", exception.Message);
    }

    [Fact]
    public void Create_WithTooLongEmail_ThrowsDomainValidationException()
    {
        // Arrange
        var longLocalPart = new string('a', 247); // 247 chars + @ + domain.com = 257 chars
        var longEmail = $"{longLocalPart}@domain.com";

        // Act & Assert
        var exception = Assert.Throws<DomainValidationException>(() => Email.Create(longEmail));
        Assert.Equal("Email cannot be longer than 256 characters", exception.Message);
    }

    [Fact]
    public void Create_WithMixedCase_NormalizesToLowerCase()
    {
        // Arrange
        var mixedCaseEmail = "User.Name@Domain.Com";
        var expectedEmail = "user.name@domain.com";

        // Act
        var email = Email.Create(mixedCaseEmail);

        // Assert
        Assert.Equal(expectedEmail, email.Value);
    }

    [Fact]
    public void Create_WithSurroundingWhitespace_TrimsWhitespace()
    {
        // Arrange
        var emailWithWhitespace = "  user@domain.com  ";
        var expectedEmail = "user@domain.com";

        // Act
        var email = Email.Create(emailWithWhitespace);

        // Assert
        Assert.Equal(expectedEmail, email.Value);
    }

    [Fact]
    public void Equals_WithSameValue_ReturnsTrue()
    {
        // Arrange
        var email1 = Email.Create("test@example.com");
        var email2 = Email.Create("test@example.com");

        // Act & Assert
        Assert.Equal(email1, email2);
        Assert.True(email1.Equals(email2));
    }

    [Fact]
    public void Equals_WithDifferentValue_ReturnsFalse()
    {
        // Arrange
        var email1 = Email.Create("test1@example.com");
        var email2 = Email.Create("test2@example.com");

        // Act & Assert
        Assert.NotEqual(email1, email2);
        Assert.False(email1.Equals(email2));
    }

    [Fact]
    public void ToString_ReturnsEmailValue()
    {
        // Arrange
        var emailValue = "test@example.com";
        var email = Email.Create(emailValue);

        // Act & Assert
        Assert.Equal(emailValue, email.ToString());
    }
}
