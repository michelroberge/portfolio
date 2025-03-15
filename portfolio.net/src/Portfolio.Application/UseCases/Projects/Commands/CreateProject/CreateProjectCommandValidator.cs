using FluentValidation;

namespace Portfolio.Application.UseCases.Projects.Commands.CreateProject;

public class CreateProjectCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title cannot be longer than 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(2000).WithMessage("Description cannot be longer than 2000 characters");

        When(x => !string.IsNullOrEmpty(x.GithubUrl), () =>
        {
            RuleFor(x => x.GithubUrl)
                .Must(url => Uri.TryCreate(url, UriKind.Absolute, out var uriResult) && 
                           (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps))
                .WithMessage("Github URL must be a valid HTTP/HTTPS URL");
        });

        When(x => !string.IsNullOrEmpty(x.LiveUrl), () =>
        {
            RuleFor(x => x.LiveUrl)
                .Must(url => Uri.TryCreate(url, UriKind.Absolute, out var uriResult) && 
                           (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps))
                .WithMessage("Live URL must be a valid HTTP/HTTPS URL");
        });

        When(x => !string.IsNullOrEmpty(x.ImageUrl), () =>
        {
            RuleFor(x => x.ImageUrl)
                .Must(url => Uri.TryCreate(url, UriKind.Absolute, out var uriResult) && 
                           (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps))
                .WithMessage("Image URL must be a valid HTTP/HTTPS URL");
        });

        RuleForEach(x => x.Technologies)
            .NotEmpty().WithMessage("Technology cannot be empty")
            .MaximumLength(50).WithMessage("Technology cannot be longer than 50 characters");
    }
}
