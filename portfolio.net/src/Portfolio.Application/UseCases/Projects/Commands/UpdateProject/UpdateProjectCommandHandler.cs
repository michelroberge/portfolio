using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Interfaces.Persistence;

namespace Portfolio.Application.UseCases.Projects.Commands.UpdateProject;

public class UpdateProjectCommandHandler : IRequestHandler<UpdateProjectCommand, ProjectDto>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<UpdateProjectCommandHandler> _logger;

    public UpdateProjectCommandHandler(
        IProjectRepository projectRepository,
        IMapper mapper,
        ILogger<UpdateProjectCommandHandler> logger)
    {
        _projectRepository = projectRepository ?? throw new ArgumentNullException(nameof(projectRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProjectDto> Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Updating project with ID: {ProjectId}", request.Id);

            var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken)
                ?? throw new NotFoundException("Project", request.Id);

            // Update project properties - entity handles validation in setters
            project.Title = request.Title;
            project.Description = request.Description;
            project.GithubUrl = request.RepositoryUrl;
            project.LiveUrl = request.LiveUrl;
            project.IsDraft = !request.IsPublished;
            project.IsFeatured = request.IsFeatured;
            project.Technologies = request.Technologies.ToList();

            _logger.LogDebug("Project entity updated with ID: {ProjectId}", project.Id);

            // Save to repository
            var savedProject = await _projectRepository.UpdateAsync(project, cancellationToken);
            _logger.LogInformation("Successfully updated project with ID: {ProjectId}", savedProject.Id);

            // Map to DTO and return
            return _mapper.Map<ProjectDto>(savedProject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating project with ID: {ProjectId}", request.Id);
            throw;
        }
    }
}
