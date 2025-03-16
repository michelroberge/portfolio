using MediatR;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Users.Commands.DeleteUser;

/// <summary>
/// Command to delete a user following CQRS pattern
/// </summary>
public record DeleteUserCommand(string Id) : ICommand<Unit>;
