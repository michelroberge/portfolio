using AutoMapper;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Projects.Queries.GetProjectBySlug;

public class GetProjectBySlugQueryHandler : IRequestHandler<GetProjectBySlugQuery, ProjectDto>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IMapper _mapper;

    public GetProjectBySlugQueryHandler(IProjectRepository projectRepository, IMapper mapper)
    {
        _projectRepository = projectRepository;
        _mapper = mapper;
    }

    public async Task<ProjectDto> Handle(GetProjectBySlugQuery request, CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetBySlugAsync(request.Slug, cancellationToken)
            ?? throw new NotFoundException($"Project with slug '{request.Slug}' not found");

        return _mapper.Map<ProjectDto>(project);
    }
}
