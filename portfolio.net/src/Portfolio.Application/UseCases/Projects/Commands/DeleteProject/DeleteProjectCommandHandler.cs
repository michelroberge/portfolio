using MediatR;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Common.Interfaces;
using Portfolio.Application.Interfaces.Persistence;

namespace Portfolio.Application.UseCases.Projects.Commands.DeleteProject;

public class DeleteProjectCommandHandler : IRequestHandler<DeleteProjectCommand, Unit>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IProjectRepository _projectRepository;

    public DeleteProjectCommandHandler(IUnitOfWork unitOfWork, IProjectRepository projectRepository)
    {
        _unitOfWork = unitOfWork;
        _projectRepository = projectRepository;
    }

    public async Task<Unit> Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException("Project", request.Id);

        await _projectRepository.DeleteAsync(request.Id);
        await _unitOfWork.CommitTransactionAsync(cancellationToken);

        return Unit.Value;
    }
}
