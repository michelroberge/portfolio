using FluentValidation;

namespace Portfolio.Application.UseCases.Blogs.Commands.CreateBlog;

public class CreateBlogCommandValidator : AbstractValidator<CreateBlogCommand>
{
    public CreateBlogCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title cannot be longer than 200 characters");

        RuleFor(x => x.Excerpt)
            .NotEmpty().WithMessage("Excerpt is required")
            .MaximumLength(500).WithMessage("Excerpt cannot be longer than 500 characters");

        RuleFor(x => x.Body)
            .NotEmpty().WithMessage("Body is required");

        RuleFor(x => x.PublishAt)
            .Must(x => !x.HasValue || x.Value > DateTime.UtcNow)
            .WithMessage("Publish date must be in the future");

        RuleForEach(x => x.Tags)
            .NotEmpty().WithMessage("Tag cannot be empty")
            .MaximumLength(50).WithMessage("Tag cannot be longer than 50 characters");
    }
}
