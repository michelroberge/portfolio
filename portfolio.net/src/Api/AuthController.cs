using Microsoft.AspNetCore.Mvc;
using Infrastructure.Services;
using Domain.DTOs;
using System.Threading.Tasks;

namespace Api;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var success = await _authService.LoginAsync(request);
        if (!success) return Unauthorized();

        return Ok(new { message = "Login successful" });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _authService.LogoutAsync();
        return Ok(new { message = "Logged out" });
    }
}
