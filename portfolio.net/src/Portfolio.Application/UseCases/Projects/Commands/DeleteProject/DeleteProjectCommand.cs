using MediatR;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Projects.Commands.DeleteProject;

/// <summary>
/// Command to delete a project following CQRS pattern
/// </summary>
public record DeleteProjectCommand(string Id) : ICommand<Unit>;
