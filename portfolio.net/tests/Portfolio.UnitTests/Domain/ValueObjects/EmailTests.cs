using FluentAssertions;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.ValueObjects;
using Xunit;

namespace Portfolio.UnitTests.Domain.ValueObjects;

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
        email.Should().NotBeNull();
        email.Value.Should().Be(validEmail.ToLowerInvariant());
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Create_WithEmptyEmail_ThrowsDomainValidationException(string invalidEmail)
    {
        // Act
        var action = () => Email.Create(invalidEmail);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Email cannot be empty");
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
        // Act
        var action = () => Email.Create(invalidEmail);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Invalid email format");
    }

    [Fact]
    public void Create_WithTooLongEmail_ThrowsDomainValidationException()
    {
        // Arrange
        var longLocalPart = new string('a', 247); // 247 chars + @ + domain.com = 257 chars
        var longEmail = $"{longLocalPart}@domain.com";

        // Act
        var action = () => Email.Create(longEmail);

        // Assert
        action.Should().Throw<DomainValidationException>()
            .WithMessage("Email cannot be longer than 256 characters");
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
        email.Value.Should().Be(expectedEmail);
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
        email.Value.Should().Be(expectedEmail);
    }

    [Fact]
    public void Equals_WithSameValue_ReturnsTrue()
    {
        // Arrange
        var email1 = Email.Create("test@example.com");
        var email2 = Email.Create("test@example.com");

        // Act & Assert
        email1.Should().Be(email2);
        email1.Equals(email2).Should().BeTrue();
    }

    [Fact]
    public void Equals_WithDifferentValue_ReturnsFalse()
    {
        // Arrange
        var email1 = Email.Create("test1@example.com");
        var email2 = Email.Create("test2@example.com");

        // Act & Assert
        email1.Should().NotBe(email2);
        email1.Equals(email2).Should().BeFalse();
    }

    [Fact]
    public void ToString_ReturnsEmailValue()
    {
        // Arrange
        var emailValue = "test@example.com";
        var email = Email.Create(emailValue);

        // Act & Assert
        email.ToString().Should().Be(emailValue);
    }

    [Fact]
    public void GetHashCode_WithSameValue_ReturnsSameHashCode()
    {
        // Arrange
        var email1 = Email.Create("test@example.com");
        var email2 = Email.Create("test@example.com");

        // Act
        var hashCode1 = email1.GetHashCode();
        var hashCode2 = email2.GetHashCode();

        // Assert
        hashCode1.Should().Be(hashCode2);
    }

    [Fact]
    public void GetHashCode_WithDifferentValue_ReturnsDifferentHashCode()
    {
        // Arrange
        var email1 = Email.Create("test1@example.com");
        var email2 = Email.Create("test2@example.com");

        // Act
        var hashCode1 = email1.GetHashCode();
        var hashCode2 = email2.GetHashCode();

        // Assert
        hashCode1.Should().NotBe(hashCode2);
    }
}
