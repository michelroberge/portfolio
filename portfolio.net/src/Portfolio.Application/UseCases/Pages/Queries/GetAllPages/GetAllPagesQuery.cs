using MediatR;
using Portfolio.Application.Common.DTOs;

namespace Portfolio.Application.UseCases.Pages.Queries.GetAllPages;

public record GetAllPagesQuery : IRequest<IEnumerable<PageDto>>;
