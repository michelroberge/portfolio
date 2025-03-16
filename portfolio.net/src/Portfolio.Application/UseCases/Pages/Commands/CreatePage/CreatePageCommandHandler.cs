using MediatR;
using Portfolio.Application.Common.Interfaces;
using Portfolio.Domain.Common;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.UseCases.Pages.Commands.CreatePage;

public class CreatePageCommandHandler : IRequestHandler<CreatePageCommand, Guid>
{
    private readonly IPageRepository _pageRepository;

    public CreatePageCommandHandler(IPageRepository pageRepository)
    {
        _pageRepository = pageRepository;
    }

    public async Task<Guid> Handle(CreatePageCommand request, CancellationToken cancellationToken)
    {
        // Check for duplicate slug
        var existingPage = await _pageRepository.GetBySlugAsync(request.Slug, cancellationToken);
        if (existingPage != null)
            throw new DuplicateSlugException($"A page with slug '{request.Slug}' already exists");

        var page = new Page(request.Title, request.Slug, request.Content);
        return await _pageRepository.CreateAsync(page, cancellationToken);
    }
}
