using MediatR;
using Microsoft.Extensions.Logging;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Interfaces.Persistence;

namespace Portfolio.Application.UseCases.Users.Commands.DeleteUser;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Unit>
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<DeleteUserCommandHandler> _logger;

    public DeleteUserCommandHandler(
        IUserRepository userRepository,
        ILogger<DeleteUserCommandHandler> logger)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Deleting user with ID: {UserId}", request.Id);

            var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken)
                ?? throw new NotFoundException($"User with ID {request.Id} not found");

            await _userRepository.DeleteAsync(user, cancellationToken);
            _logger.LogInformation("Successfully deleted user with ID: {UserId}", request.Id);

            return Unit.Value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user with ID: {UserId}", request.Id);
            throw;
        }
    }
}
