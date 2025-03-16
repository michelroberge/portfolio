using MediatR;
using Portfolio.Application.UseCases.Pages.Common;

namespace Portfolio.Application.UseCases.Pages.Queries.GetPageById;

public record GetPageByIdQuery(Guid Id) : IRequest<PageDto>;
