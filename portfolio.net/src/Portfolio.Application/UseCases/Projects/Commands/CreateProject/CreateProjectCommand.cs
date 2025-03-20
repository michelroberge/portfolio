using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Projects.Commands.CreateProject;

public record CreateProjectCommand : ICommand<ProjectDto>
{
    public required string Title { get; init; }
    public required string Description { get; init; }
    public string? GithubUrl { get; init; }
    public string? LiveUrl { get; init; }
    public string? ImageUrl { get; init; }
    public IReadOnlyCollection<string> Technologies { get; init; } = Array.Empty<string>();
}
