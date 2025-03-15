using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.UseCases.Projects.Commands.CreateProject;

public class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, ProjectDto>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<CreateProjectCommandHandler> _logger;

    public CreateProjectCommandHandler(
        IProjectRepository projectRepository,
        IMapper mapper,
        ILogger<CreateProjectCommandHandler> logger)
    {
        _projectRepository = projectRepository ?? throw new ArgumentNullException(nameof(projectRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProjectDto> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creating new project with title: {Title}", request.Title);

            // Get next vector ID for the project
            var vectorId = await _projectRepository.GetNextVectorIdAsync(cancellationToken);
            _logger.LogDebug("Retrieved next vector ID: {VectorId}", vectorId);

            // Create new project entity
            var project = new Project(
                id: Guid.NewGuid().ToString(),
                title: request.Title,
                description: request.Description,
                link: string.Empty,
                githubUrl: request.GithubUrl,
                liveUrl: request.LiveUrl,
                imageUrl: request.ImageUrl,
                vectorId: vectorId
            );

            // Add technologies if any
            foreach (var technology in request.Technologies)
            {
                project.AddTechnology(technology);
            }

            _logger.LogDebug("Project entity created with ID: {ProjectId}", project.Id);

            // Save to repository
            var createdProject = await _projectRepository.AddAsync(project, cancellationToken);
            _logger.LogInformation("Successfully created project with ID: {ProjectId}", createdProject.Id);

            // Map to DTO and return
            return _mapper.Map<ProjectDto>(createdProject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating project with title: {Title}", request.Title);
            throw;
        }
    }
}
