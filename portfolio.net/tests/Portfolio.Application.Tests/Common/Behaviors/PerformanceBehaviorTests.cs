using Microsoft.Extensions.Logging;
using Moq;
using Portfolio.Application.Common.Behaviors;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;
using Portfolio.Application.Interfaces.Services;
using Xunit;

namespace Portfolio.Application.Tests.Common.Behaviors;

public class PerformanceBehaviorTests
{
    private readonly Mock<ILogger<PerformanceBehavior<TestCommand, BlogDto>>> _mockLogger;
    private readonly Mock<ICurrentUserService> _mockCurrentUserService;
    private readonly PerformanceBehavior<TestCommand, BlogDto> _behavior;

    public PerformanceBehaviorTests()
    {
        _mockLogger = new Mock<ILogger<PerformanceBehavior<TestCommand, BlogDto>>>();
        _mockCurrentUserService = new Mock<ICurrentUserService>();
        _behavior = new PerformanceBehavior<TestCommand, BlogDto>(
            _mockLogger.Object,
            _mockCurrentUserService.Object);
    }

    [Fact]
    public async Task Handle_FastOperation_ShouldNotLogWarning()
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
        VerifyLogWarningWasNeverCalled();
    }

    [Fact]
    public async Task Handle_SlowOperation_ShouldLogWarning()
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

        _mockCurrentUserService.Setup(x => x.UserId).Returns("test-user-id");
        _mockCurrentUserService.Setup(x => x.UserName).Returns("test-user");

        // Act
        var result = await _behavior.Handle(
            command,
            async () =>
            {
                await Task.Delay(600); // Delay to simulate slow operation
                return expectedResult;
            },
            CancellationToken.None);

        // Assert
        Assert.Equal(expectedResult, result);
        VerifyLogWarningWasCalled();
    }

    [Fact]
    public async Task Handle_Exception_ShouldNotSuppressException()
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
    }

    private void VerifyLogWarningWasNeverCalled()
    {
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Never);
    }

    private void VerifyLogWarningWasCalled()
    {
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Warning,
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
