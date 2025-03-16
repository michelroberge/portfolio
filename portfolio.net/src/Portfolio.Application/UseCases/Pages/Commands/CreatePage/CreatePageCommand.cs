using MediatR;
using Portfolio.Application.Common.DTOs;

namespace Portfolio.Application.UseCases.Pages.Commands.CreatePage;

public record CreatePageCommand(
    string Title, 
    string Slug, 
    string Content,
    string? MetaDescription = null,
    IReadOnlyCollection<string>? MetaKeywords = null,
    string? OpenGraphImage = null) : IRequest<PageDto>;
