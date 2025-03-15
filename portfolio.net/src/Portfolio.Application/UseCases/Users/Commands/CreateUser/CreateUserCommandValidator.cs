using FluentValidation;
using Portfolio.Application.Interfaces.Persistence;

namespace Portfolio.Application.UseCases.Users.Commands.CreateUser;

public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    private readonly IUserRepository _userRepository;

    public CreateUserCommandValidator(IUserRepository userRepository)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));

        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username is required")
            .MinimumLength(3).WithMessage("Username must be at least 3 characters")
            .MaximumLength(50).WithMessage("Username cannot be longer than 50 characters")
            .MustAsync(async (username, cancellation) => await _userRepository.IsUsernameUniqueAsync(username, cancellation))
            .WithMessage("Username is already taken");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MustAsync(async (email, cancellation) => await _userRepository.IsEmailUniqueAsync(email, cancellation))
            .WithMessage("Email is already registered");

        When(x => !string.IsNullOrEmpty(x.DisplayName), () =>
        {
            RuleFor(x => x.DisplayName)
                .MaximumLength(100).WithMessage("Display name cannot be longer than 100 characters");
        });

        When(x => !string.IsNullOrEmpty(x.AvatarUrl), () =>
        {
            RuleFor(x => x.AvatarUrl)
                .Must(url => Uri.TryCreate(url, UriKind.Absolute, out var uriResult) && 
                           (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps))
                .WithMessage("Avatar URL must be a valid HTTP/HTTPS URL");
        });

        When(x => !string.IsNullOrEmpty(x.Provider), () =>
        {
            RuleFor(x => x.ProviderId)
                .NotEmpty().WithMessage("Provider ID is required when Provider is specified");
        });
    }
}
