using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Projects.Queries.GetProjectBySlug;

/// <summary>
/// Query to retrieve a project by its slug following CQRS pattern
/// </summary>
public record GetProjectBySlugQuery(string Slug) : IQuery<ProjectDto>;
