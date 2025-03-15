using Microsoft.Extensions.Logging;
using Moq;
using Portfolio.Application.Common.Behaviors;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;
using Portfolio.Application.Interfaces.Persistence;
using Xunit;

namespace Portfolio.Application.Tests.Common.Behaviors;

public class TransactionBehaviorTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<ILogger<TransactionBehavior<TestCommand, BlogDto>>> _mockLogger;
    private readonly TransactionBehavior<TestCommand, BlogDto> _behavior;

    public TransactionBehaviorTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockLogger = new Mock<ILogger<TransactionBehavior<TestCommand, BlogDto>>>();
        _behavior = new TransactionBehavior<TestCommand, BlogDto>(
            _mockUnitOfWork.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task Handle_Command_ShouldUseTransaction()
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
        _mockUnitOfWork.Verify(x => x.BeginTransactionAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(x => x.CommitTransactionAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(x => x.RollbackTransactionAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Query_ShouldNotUseTransaction()
    {
        // Arrange
        var query = new TestQuery();
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
            query,
            () => Task.FromResult(expectedResult),
            CancellationToken.None);

        // Assert
        Assert.Equal(expectedResult, result);
        _mockUnitOfWork.Verify(x => x.BeginTransactionAsync(It.IsAny<CancellationToken>()), Times.Never);
        _mockUnitOfWork.Verify(x => x.CommitTransactionAsync(It.IsAny<CancellationToken>()), Times.Never);
        _mockUnitOfWork.Verify(x => x.RollbackTransactionAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Exception_ShouldRollbackTransaction()
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
        _mockUnitOfWork.Verify(x => x.BeginTransactionAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(x => x.CommitTransactionAsync(It.IsAny<CancellationToken>()), Times.Never);
        _mockUnitOfWork.Verify(x => x.RollbackTransactionAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    private class TestCommand : ICommand<BlogDto>
    {
        public string? Title { get; set; }
    }

    private class TestQuery : IQuery<BlogDto>
    {
        public string? Title { get; set; }
    }
}
