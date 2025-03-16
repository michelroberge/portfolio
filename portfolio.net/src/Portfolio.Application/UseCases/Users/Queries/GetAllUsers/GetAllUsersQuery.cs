using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Users.Queries.GetAllUsers;

/// <summary>
/// Query to retrieve all users following CQRS pattern
/// </summary>
public record GetAllUsersQuery : IQuery<IEnumerable<UserDto>>;
