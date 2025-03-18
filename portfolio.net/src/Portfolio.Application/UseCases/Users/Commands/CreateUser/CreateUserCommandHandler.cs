using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Application.Interfaces.Services;
using Portfolio.Domain.Entities;
using Portfolio.Domain.ValueObjects;

namespace Portfolio.Application.UseCases.Users.Commands.CreateUser;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, UserDto>
{
    private readonly IIdentityService _identityService;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<CreateUserCommandHandler> _logger;

    public CreateUserCommandHandler(
        IIdentityService identityService,
        IUserRepository userRepository,
        IMapper mapper,
        ILogger<CreateUserCommandHandler> logger)
    {
        _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creating new user with username: {Username}", request.Username);

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
                isAdmin: request.IsAdmin
            );

            _logger.LogDebug("User entity created with ID: {UserId}", user.Id);

            // Save to repository
            var createdUser = await _userRepository.AddAsync(user, cancellationToken);
            _logger.LogInformation("Successfully created user with ID: {UserId}", createdUser.Id);


            var createdIdentityUser = await _identityService.CreateUserAsync(
                createdUser.Username, 
                createdUser.Email.Value,
                request.Password
                );

            if (createdIdentityUser.Succeeded)
            {
                _logger.LogInformation("Successfully created Identity User with ID: {UserId}", createdUser.Id);
            }
            else
            {
                foreach(var err in createdIdentityUser.Errors)
                {
                    _logger.LogError("Could not create user {username}: {err}", request.Username, err);
                }
                throw new Exception("IdentityService.CreateUserAsync error");
            }

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
