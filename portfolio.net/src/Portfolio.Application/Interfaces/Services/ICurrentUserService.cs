namespace Portfolio.Application.Interfaces.Services
{
    public interface ICurrentUserService
    {
        /// <summary>
        /// Gets the current authenticated user ID or assigns an anonymous UID.
        /// </summary>
        string UserId { get; }

        /// <summary>
        /// Gets the current user's roles (if any).
        /// </summary>
        List<string> Roles { get; }

        /// <summary>
        /// Checks if the current user is authenticated.
        /// </summary>
        bool IsAuthenticated { get; }
    }
}
