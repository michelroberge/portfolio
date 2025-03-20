using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;
using Portfolio.Domain.ValueObjects;
using Portfolio.Infrastructure.Persistence;
using Portfolio.Infrastructure.Persistence.Repositories;
using Xunit;

namespace Portfolio.UnitTests.Repositories;

public class UserRepositoryTests : IDisposable
{
    private readonly DbContextOptions<ApplicationDbContext> _options;
    private readonly ApplicationDbContext _context;
    private readonly UserRepository _repository;

    public UserRepositoryTests()
    {
        _options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
            .Options;

        _context = new ApplicationDbContext(_options);
        _repository = new UserRepository(_context);
    }

    [Fact]
    public async Task GetByUsername_ShouldReturnUser_WhenUserExists()
    {
        // Arrange
        var user = new User(
            id: Guid.NewGuid().ToString(),
            username: "testuser",
            email: Email.Create("test@example.com"),
            displayName: "Test User",
            avatarUrl: "https://example.com/avatar.jpg",
            provider: "local",
            providerId: null,
            isAdmin: false
        );

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByUsernameAsync(user.Username);

        // Assert
        result.Should().NotBeNull();
        result!.Username.Should().Be(user.Username);
        result.Email.Value.Should().Be(user.Email.Value);
        result.DisplayName.Should().Be(user.DisplayName);
    }

    [Fact]
    public async Task GetByEmail_ShouldReturnUser_WhenUserExists()
    {
        // Arrange
        var user = new User(
            id: Guid.NewGuid().ToString(),
            username: "testuser",
            email: Email.Create("test@example.com"),
            displayName: "Test User"
        );

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByEmailAsync(user.Email.Value);

        // Assert
        result.Should().NotBeNull();
        result!.Email.Value.Should().Be(user.Email.Value);
    }

    [Fact]
    public async Task IsUsernameUnique_ShouldReturnTrue_WhenUsernameDoesNotExist()
    {
        // Arrange
        var username = "uniqueuser";

        // Act
        var result = await _repository.IsUsernameUniqueAsync(username);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task IsUsernameUnique_ShouldReturnFalse_WhenUsernameExists()
    {
        // Arrange
        var user = new User(
            id: Guid.NewGuid().ToString(),
            username: "existinguser",
            email: Email.Create("test@example.com")
        );

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.IsUsernameUniqueAsync(user.Username);

        // Assert
        result.Should().BeFalse();
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
