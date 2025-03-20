using MediatR;
using Microsoft.AspNetCore.Builder;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.UseCases.Pages.Commands.CreatePage;
using Portfolio.Application.UseCases.Pages.Commands.DeletePage;
using Portfolio.Application.UseCases.Pages.Commands.UpdatePage;
using Portfolio.Application.UseCases.Pages.Queries.GetAllPages;
using Portfolio.Application.UseCases.Pages.Queries.GetPageById;
using Portfolio.Application.UseCases.Pages.Queries.GetPageBySlug;

namespace Portfolio.WebApi.Extensions.Endpoints;

/// <summary>
/// Configures endpoints for the Page aggregate following DDD principles
/// </summary>
public static class PageEndpoints
{
    public static IEndpointRouteBuilder MapPageEndpoints(this IEndpointRouteBuilder app)
    {
        var group = EndpointBase.CreateGroup(app, "pages", "Pages");

        // Configure standard CRUD endpoints
        group.MapCrudEndpoints<CreatePageCommand, UpdatePageCommand, DeletePageCommand,
            GetAllPagesQuery, GetPageByIdQuery, PageDto>("Page");

        // Additional domain-specific endpoints
        group.MapGet("/by-slug/{slug}", async (IMediator mediator, string slug) =>
        {
            try
            {
                var result = await mediator.Send(new GetPageBySlugQuery(slug));
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return EndpointBase.HandleException(ex);
            }
        })
        .WithName("GetPageBySlug")
        .WithDescription("Retrieves a page by its slug");

        return app;
    }
}
