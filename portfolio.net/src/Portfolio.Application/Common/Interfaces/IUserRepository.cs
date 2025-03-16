using Portfolio.Domain.Entities;

namespace Portfolio.Application.Common.Interfaces;

/// <summary>
/// Repository interface for User entity following Clean Architecture principles
/// </summary>
public interface IUserRepository : IRepository<User>
{
    /// <summary>
    /// Gets a user by their username
    /// </summary>
    /// <param name="username">The username</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The user if found, null otherwise</returns>
    Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a user by their email
    /// </summary>
    /// <param name="email">The email address</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The user if found, null otherwise</returns>
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a user by their provider ID
    /// </summary>
    /// <param name="provider">The authentication provider (e.g., 'github', 'google')</param>
    /// <param name="providerId">The provider-specific user ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The user if found, null otherwise</returns>
    Task<User?> GetByProviderIdAsync(string provider, string providerId, CancellationToken cancellationToken = default);
}
