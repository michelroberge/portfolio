using AutoMapper;
using MediatR;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Interfaces.Persistence;
using Portfolio.Domain.Entities;
using System.Runtime.CompilerServices;

namespace Portfolio.Application.UseCases.Pages.Commands.CreatePage;

public class CreatePageCommandHandler : IRequestHandler<CreatePageCommand, PageDto>
{
    private readonly IPageRepository _pageRepository;
    private readonly IMapper _mapper;

    public CreatePageCommandHandler(IPageRepository pageRepository, IMapper mapper)
    {
        _pageRepository = pageRepository;
        _mapper = mapper;
    }

    public async Task<PageDto> Handle(CreatePageCommand request, CancellationToken cancellationToken)
    {
        // Check for duplicate slug
        var existingPage = await _pageRepository.GetBySlugAsync(request.Slug, cancellationToken);
        if (existingPage != null)
            throw new ValidationException($"A page with slug '{request.Slug}' already exists.");

        // Create new page entity following DDD principles
        var page = new Page(
            title: request.Title,
            slug: request.Slug,
            content: request.Content,
            metaDescription: request.MetaDescription,
            metaKeywords: request.MetaKeywords?.ToList(),
            openGraphImage: request.OpenGraphImage
        );

        // Save to repository
        var createdPage = await _pageRepository.AddAsync(page, cancellationToken);

        // Map to DTO and return
        return _mapper.Map<PageDto>(createdPage);
    }
}
