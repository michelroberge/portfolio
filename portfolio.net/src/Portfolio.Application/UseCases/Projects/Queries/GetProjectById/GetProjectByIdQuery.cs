using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Projects.Queries.GetProjectById;

/// <summary>
/// Query to retrieve a project by its ID following CQRS pattern
/// </summary>
public record GetProjectByIdQuery(string Id) : IQuery<ProjectDto>;
