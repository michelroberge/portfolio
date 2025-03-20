using MediatR;
using Portfolio.Application.Common.DTOs;

namespace Portfolio.Application.UseCases.Projects.Commands.UpdateProject;

/// <summary>
/// Command to update a project following CQRS pattern and DDD principles
/// </summary>
public record UpdateProjectCommand : IRequest<ProjectDto>
{
    public required string Id { get; init; }
    public required string Title { get; init; }
    public required string Description { get; init; }
    public required string Link { get; init; }
    public string? GithubUrl { get; init; }
    public string? LiveUrl { get; init; }
    public string? ImageUrl { get; init; }
    public bool IsDraft { get; init; }
    public bool IsFeatured { get; init; }
    public IReadOnlyCollection<string> Technologies { get; init; } = Array.Empty<string>();
}
