using MediatR;
using Portfolio.Application.UseCases.Pages.Common;

namespace Portfolio.Application.UseCases.Pages.Queries.GetAllPages;

public record GetAllPagesQuery : IRequest<IEnumerable<PageDto>>;
