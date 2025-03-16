using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.ValueObjects;

namespace Portfolio.Application.UseCases.Users.Commands.UpdateUser;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<UpdateUserCommandHandler> _logger;

    public UpdateUserCommandHandler(
        IUserRepository userRepository,
        IMapper mapper,
        ILogger<UpdateUserCommandHandler> logger)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Updating user with ID: {UserId}", request.Id);

            var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken)
                ?? throw new NotFoundException("User", request.Id);

            // Update user properties - entity handles validation in setters
            user.Username = request.Username;
            user.DisplayName = request.DisplayName;
            user.AvatarUrl = request.AvatarUrl;
            user.Email = Email.Create(request.Email);
            user.IsAdmin = request.IsAdmin;

            _logger.LogDebug("User entity updated with ID: {UserId}", user.Id);

            // Save to repository
            var savedUser = await _userRepository.UpdateAsync(user, cancellationToken);
            _logger.LogInformation("Successfully updated user with ID: {UserId}", savedUser.Id);

            // Map to DTO and return
            return _mapper.Map<UserDto>(savedUser);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user with ID: {UserId}", request.Id);
            throw;
        }
    }
}
