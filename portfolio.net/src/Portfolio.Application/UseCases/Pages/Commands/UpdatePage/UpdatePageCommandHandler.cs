using MediatR;
using Portfolio.Application.Common.Interfaces;
using Portfolio.Domain.Common;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.UseCases.Pages.Commands.UpdatePage;

public class UpdatePageCommandHandler(IPageRepository pageRepository) : IRequestHandler<UpdatePageCommand, Unit>
{
    public async Task<Unit> Handle(UpdatePageCommand request, CancellationToken cancellationToken)
    {
        // Get existing page
        var existingPage = await pageRepository.GetByIdAsync(request.Id, cancellationToken);
        if (existingPage == null)
            throw new NotFoundException($"Page with ID {request.Id} not found", nameof(Page), request.Id);

        // Validate slug uniqueness
        if (!string.Equals(existingPage.Slug, request.Slug, StringComparison.OrdinalIgnoreCase))
        {
            var pageWithSlug = await pageRepository.GetBySlugAsync(request.Slug, cancellationToken);
            if (pageWithSlug != null && pageWithSlug.Id.Equals(request.Id) == false)
                throw new DuplicateSlugException($"A page with slug '{request.Slug}' already exists");
        }

        // Update page using domain entity's Update method
        var updatedPage = existingPage.Update(
            request.Title.Trim(),
            request.Slug.Trim().ToLowerInvariant(),
            request.Content.Trim()
        );

        // Persist changes
        await pageRepository.UpdateAsync(updatedPage, cancellationToken);
        return Unit.Value;
    }
}
