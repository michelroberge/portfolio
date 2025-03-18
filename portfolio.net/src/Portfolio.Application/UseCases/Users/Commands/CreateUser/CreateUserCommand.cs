using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Users.Commands.CreateUser;

public record CreateUserCommand : ICommand<UserDto>
{
    public required string Username { get; init; }
    public required string Email { get; init; }
    public string? DisplayName { get; init; }
    public string? AvatarUrl { get; init; }
    public string? Provider { get; init; }
    public string? ProviderId { get; init; }
    public bool IsAdmin { get; init; }

    public required string Password {  get; init; }
}
