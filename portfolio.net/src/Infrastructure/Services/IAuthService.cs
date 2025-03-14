using Domain.DTOs;

namespace Infrastructure.Services;

public interface IAuthService
{
    Task<bool> LoginAsync(LoginRequest request);
    Task LogoutAsync();
}
