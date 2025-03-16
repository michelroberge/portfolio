using AutoMapper;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Projects.Queries.GetAllProjects;

public class GetAllProjectsQueryHandler : IRequestHandler<GetAllProjectsQuery, IEnumerable<ProjectDto>>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IMapper _mapper;

    public GetAllProjectsQueryHandler(IProjectRepository projectRepository, IMapper mapper)
    {
        _projectRepository = projectRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProjectDto>> Handle(GetAllProjectsQuery request, CancellationToken cancellationToken)
    {
        var projects = await _projectRepository.GetAllAsync(cancellationToken);
        return _mapper.Map<IEnumerable<ProjectDto>>(projects);
    }
}
