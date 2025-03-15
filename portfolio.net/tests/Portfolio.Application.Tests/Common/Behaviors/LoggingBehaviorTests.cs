using Microsoft.Extensions.Logging;
using Moq;
using Portfolio.Application.Common.Behaviors;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;
using Xunit;

namespace Portfolio.Application.Tests.Common.Behaviors;

public class LoggingBehaviorTests
{
    private readonly Mock<ILogger<LoggingBehavior<TestCommand, BlogDto>>> _mockLogger;
    private readonly LoggingBehavior<TestCommand, BlogDto> _behavior;

    public LoggingBehaviorTests()
    {
        _mockLogger = new Mock<ILogger<LoggingBehavior<TestCommand, BlogDto>>>();
        _behavior = new LoggingBehavior<TestCommand, BlogDto>(_mockLogger.Object);
    }

    [Fact]
    public async Task Handle_SuccessfulOperation_ShouldLogStartAndCompletion()
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

        // Act
        var result = await _behavior.Handle(
            command,
            () => Task.FromResult(expectedResult),
            CancellationToken.None);

        // Assert
        Assert.Equal(expectedResult, result);
        VerifyLogInformationWasCalledTwice();
    }

    [Fact]
    public async Task Handle_FailedOperation_ShouldLogError()
    {
        // Arrange
        var command = new TestCommand();
        var expectedException = new Exception("Test exception");

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() =>
            _behavior.Handle(
                command,
                () => throw expectedException,
                CancellationToken.None));

        Assert.Equal(expectedException, exception);
        VerifyLogErrorWasCalled();
    }

    private void VerifyLogInformationWasCalledTwice()
    {
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Exactly(2));
    }

    private void VerifyLogErrorWasCalled()
    {
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    private class TestCommand : ICommand<BlogDto>
    {
        public string? Title { get; set; }
    }
}
