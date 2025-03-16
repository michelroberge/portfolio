using MediatR;
using Portfolio.Application.UseCases.Pages.Common;

namespace Portfolio.Application.UseCases.Pages.Queries.GetPageBySlug;

public record GetPageBySlugQuery(string Slug) : IRequest<PageDto>;
