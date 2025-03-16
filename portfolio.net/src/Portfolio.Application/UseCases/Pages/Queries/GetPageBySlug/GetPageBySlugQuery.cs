using MediatR;
using Portfolio.Application.Common.DTOs;

namespace Portfolio.Application.UseCases.Pages.Queries.GetPageBySlug;

public record GetPageBySlugQuery(string Slug) : IRequest<PageDto>;
