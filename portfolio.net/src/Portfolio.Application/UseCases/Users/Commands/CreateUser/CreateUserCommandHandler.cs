using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;
using Portfolio.Domain.ValueObjects;

namespace Portfolio.Application.UseCases.Users.Commands.CreateUser;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, UserDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<CreateUserCommandHandler> _logger;

    public CreateUserCommandHandler(
        IUserRepository userRepository,
        IMapper mapper,
        ILogger<CreateUserCommandHandler> logger)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creating new user with username: {Username}", request.Username);

            // Check if username is unique
            if (!await _userRepository.IsUsernameUniqueAsync(request.Username, cancellationToken))
            {
                _logger.LogWarning("Username {Username} is already taken", request.Username);
                throw new Common.Exceptions.ValidationException("Username is already taken");
            }

            // Check if email is unique
            if (!await _userRepository.IsEmailUniqueAsync(request.Email, cancellationToken))
            {
                _logger.LogWarning("Email {Email} is already registered", request.Email);
                throw new Common.Exceptions.ValidationException("Email is already registered");
            }

            // Create Email value object
            var email = Email.Create(request.Email);
            _logger.LogDebug("Created Email value object for {Email}", request.Email);

            // Create new user entity
            var user = new User(
                id: Guid.NewGuid().ToString(),
                username: request.Username,
                email: email,
                displayName: request.DisplayName,
                avatarUrl: request.AvatarUrl,
                provider: request.Provider,
                providerId: request.ProviderId,
                isAdmin: request.IsAdmin
            );

            _logger.LogDebug("User entity created with ID: {UserId}", user.Id);

            // Save to repository
            var createdUser = await _userRepository.AddAsync(user, cancellationToken);
            _logger.LogInformation("Successfully created user with ID: {UserId}", createdUser.Id);

            // Map to DTO and return
            return _mapper.Map<UserDto>(createdUser);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user with username: {Username}", request.Username);
            throw;
        }
    }
}
