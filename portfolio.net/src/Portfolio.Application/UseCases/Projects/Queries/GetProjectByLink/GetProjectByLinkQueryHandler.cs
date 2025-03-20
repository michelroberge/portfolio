using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Interfaces.Persistence;

namespace Portfolio.Application.UseCases.Projects.Queries.GetProjectByLink;

public class GetProjectByLinkQueryHandler : IRequestHandler<GetProjectByLinkQuery, ProjectDto?>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetProjectByLinkQueryHandler> _logger;

    public GetProjectByLinkQueryHandler(
        IProjectRepository projectRepository,
        IMapper mapper,
        ILogger<GetProjectByLinkQueryHandler> logger)
    {
        _projectRepository = projectRepository ?? throw new ArgumentNullException(nameof(projectRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProjectDto?> Handle(GetProjectByLinkQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Fetching project with link: {Link}", request.Link);

            var project = await _projectRepository.GetByLinkAsync(request.Link, cancellationToken);

            if (project == null)
            {
                _logger.LogWarning("Project with link {Link} not found", request.Link);
                return null;
            }

            _logger.LogDebug("Successfully retrieved project with ID: {ProjectId}", project.Id);
            return _mapper.Map<ProjectDto>(project);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching project with link: {Link}", request.Link);
            throw;
        }
    }
}
