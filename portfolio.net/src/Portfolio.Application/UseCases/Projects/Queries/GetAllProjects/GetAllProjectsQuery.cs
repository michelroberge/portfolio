using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Projects.Queries.GetAllProjects;

/// <summary>
/// Query to retrieve all projects following CQRS pattern
/// </summary>
public record GetAllProjectsQuery : IQuery<IEnumerable<ProjectDto>>;
