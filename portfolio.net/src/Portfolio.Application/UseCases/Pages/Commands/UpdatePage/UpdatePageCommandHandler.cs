using AutoMapper;
using MediatR;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.UseCases.Pages.Commands.UpdatePage;

public class UpdatePageCommandHandler : IRequestHandler<UpdatePageCommand, PageDto>
{
    private readonly IPageRepository _pageRepository;
    private readonly IMapper _mapper;

    public UpdatePageCommandHandler(IPageRepository pageRepository, IMapper mapper)
    {
        _pageRepository = pageRepository;
        _mapper = mapper;
    }

    public async Task<PageDto> Handle(UpdatePageCommand request, CancellationToken cancellationToken)
    {
        // Get existing page
        var page = await _pageRepository.GetByIdAsync(request.Id, cancellationToken);
        if (page == null)
            throw new NotFoundException(nameof(Page), request.Id);

        // Check for duplicate slug if changed
        if (request.Slug != page.Slug)
        {
            var existingPage = await _pageRepository.GetBySlugAsync(request.Slug, cancellationToken);
            if (existingPage != null)
                throw new ValidationException($"A page with slug '{request.Slug}' already exists.");
        }

        // Update page following DDD principles
        var updatedPage = page.Update(
            title: request.Title,
            slug: request.Slug,
            content: request.Content,
            metaDescription: request.MetaDescription,
            metaKeywords: request.MetaKeywords?.ToList(),
            openGraphImage: request.OpenGraphImage,
            isDraft: request.IsDraft,
            isPublished: request.IsPublished
        );

        // Save changes
        await _pageRepository.UpdateAsync(updatedPage, cancellationToken);

        // Map to DTO and return
        return _mapper.Map<PageDto>(updatedPage);
    }
}
