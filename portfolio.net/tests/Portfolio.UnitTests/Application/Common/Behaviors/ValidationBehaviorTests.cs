using FluentValidation;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using Moq;
using Portfolio.Application.Common.Behaviors;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;
using Xunit;

namespace Portfolio.Application.Tests.Common.Behaviors;

public class ValidationBehaviorTests
{
    private readonly Mock<IValidator<TestCommand>> _mockValidator;
    private readonly Mock<ILogger<ValidationBehavior<TestCommand, BlogDto>>> _mockLogger;
    private readonly ValidationBehavior<TestCommand, BlogDto> _behavior;

    public ValidationBehaviorTests()
    {
        _mockValidator = new Mock<IValidator<TestCommand>>();
        _mockLogger = new Mock<ILogger<ValidationBehavior<TestCommand, BlogDto>>>();
        _behavior = new ValidationBehavior<TestCommand, BlogDto>(
            new[] { _mockValidator.Object },
            _mockLogger.Object);
    }

    [Fact]
    public async Task Handle_ValidRequest_ShouldProceed()
    {
        // Arrange
        var command = new TestCommand();
        var expectedResult = new BlogDto
        {
            Id = "test-id",
            Title = "Test Blog",
            Excerpt = "Test Excerpt",
            Body = "Test Body",
            IsDraft = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _mockValidator
            .Setup(x => x.ValidateAsync(It.IsAny<ValidationContext<TestCommand>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        // Act
        var result = await _behavior.Handle(
            command,
            () => Task.FromResult(expectedResult),
            CancellationToken.None);

        // Assert
        Assert.Equal(expectedResult, result);
        _mockValidator.Verify(
            x => x.ValidateAsync(It.IsAny<ValidationContext<TestCommand>>(), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_InvalidRequest_ShouldThrowValidationException()
    {
        // Arrange
        var command = new TestCommand();
        var validationFailures = new[]
        {
            new ValidationFailure("Title", "Title is required"),
            new ValidationFailure("Excerpt", "Excerpt is required")
        };

        _mockValidator
            .Setup(x => x.ValidateAsync(It.IsAny<ValidationContext<TestCommand>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult(validationFailures));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ValidationException>(() =>
            _behavior.Handle(
                command,
                () => Task.FromResult(new BlogDto()),
                CancellationToken.None));

        Assert.Equal(validationFailures, exception.Errors);
        _mockValidator.Verify(
            x => x.ValidateAsync(It.IsAny<ValidationContext<TestCommand>>(), It.IsAny<CancellationToken>()),
            Times.Once);
    }

    private class TestCommand : ICommand<BlogDto>
    {
        public string? Title { get; set; }
        public string? Excerpt { get; set; }
    }
}
