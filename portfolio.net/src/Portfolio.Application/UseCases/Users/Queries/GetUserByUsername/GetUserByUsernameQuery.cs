using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Users.Queries.GetUserByUsername;

public record GetUserByUsernameQuery : IQuery<UserDto?>
{
    public required string Username { get; init; }
}
