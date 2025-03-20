using MediatR;
using Portfolio.Application.Common.DTOs;

namespace Portfolio.Application.UseCases.Pages.Queries.GetPageById;

public record GetPageByIdQuery(string Id) : IRequest<PageDto>;
