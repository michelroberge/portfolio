using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Users.Queries.GetUserById;

/// <summary>
/// Query to retrieve a user by their ID following CQRS pattern
/// </summary>
public record GetUserByIdQuery(string Id) : IQuery<UserDto>;
