using MediatR;
using Portfolio.Application.Common.DTOs;

namespace Portfolio.Application.UseCases.Users.Commands.UpdateUser;

/// <summary>
/// Command to update a user following CQRS pattern and DDD principles
/// </summary>
public record UpdateUserCommand : IRequest<UserDto>
{
    public required string Id { get; init; }
    public required string Username { get; init; }
    public required string Email { get; init; }
    public string? DisplayName { get; init; }
    public string? AvatarUrl { get; init; }
    public bool IsAdmin { get; init; }
}
