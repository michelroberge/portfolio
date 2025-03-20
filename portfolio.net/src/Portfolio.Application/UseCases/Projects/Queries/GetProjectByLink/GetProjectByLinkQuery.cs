using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Projects.Queries.GetProjectByLink;

public record GetProjectByLinkQuery : IQuery<ProjectDto?>
{
    public required string Link { get; init; }
}
