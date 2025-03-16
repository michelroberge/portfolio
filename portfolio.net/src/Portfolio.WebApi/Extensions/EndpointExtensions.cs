using MediatR;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.UseCases.Pages.Commands.CreatePage;
using Portfolio.Application.UseCases.Pages.Commands.DeletePage;
using Portfolio.Application.UseCases.Pages.Commands.UpdatePage;
using Portfolio.Application.UseCases.Pages.Queries.GetAllPages;
using Portfolio.Application.UseCases.Pages.Queries.GetPageById;
using Portfolio.Application.UseCases.Pages.Queries.GetPageBySlug;
using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;

namespace Portfolio.WebApi.Extensions;

public static class EndpointExtensions
{
    public static WebApplication MapEndpoints(this WebApplication app)
    {
        app.MapPageEndpoints();
        return app;
    }

    private static IEndpointRouteBuilder MapPageEndpoints(this IEndpointRouteBuilder app)
    {
        var pages = app.MapGroup("/api/pages")
            .WithTags("Pages")
            .WithOpenApi();

        // Commands
        pages.MapPost("/", async (IMediator mediator, [FromBody] CreatePageCommand command) =>
        {
            try
            {
                var result = await mediator.Send(command);
                return Results.Created($"/api/pages/{result}", result);
            }
            catch (DomainValidationException ex)
            {
                return Results.BadRequest(ex.Message);
            }
            catch (NotFoundException ex)
            {
                return Results.NotFound(ex.Message);
            }
        })
        .WithName("CreatePage")
        .WithDescription("Creates a new page");

        pages.MapPut("/{id:guid}", async (IMediator mediator, string id, [FromBody] UpdatePageCommand command) =>
        {
            try 
            {
                if (id != command.Id) return Results.BadRequest("Id mismatch");
                await mediator.Send(command);
                return Results.NoContent();
            }
            catch (NotFoundException ex)
            {
                return Results.NotFound(ex.Message);
            }
            catch (DomainValidationException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .WithName("UpdatePage")
        .WithDescription("Updates an existing page");

        pages.MapDelete("/{id:guid}", async (IMediator mediator, string id) =>
        {
            try
            {
                await mediator.Send(new DeletePageCommand(id));
                return Results.NoContent();
            }
            catch (NotFoundException ex)
            {
                return Results.NotFound(ex.Message);
            }
        })
        .WithName("DeletePage")
        .WithDescription("Deletes a page");

        // Queries
        pages.MapGet("/", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new GetAllPagesQuery());
            return Results.Ok(result);
        })
        .WithName("GetAllPages")
        .WithDescription("Retrieves all pages");

        pages.MapGet("/{id:guid}", async (IMediator mediator, string id) =>
        {
            try
            {
                var result = await mediator.Send(new GetPageByIdQuery(id));
                return Results.Ok(result);
            }
            catch (NotFoundException ex)
            {
                return Results.NotFound(ex.Message);
            }
        })
        .WithName("GetPageById")
        .WithDescription("Retrieves a page by its ID");

        pages.MapGet("/by-slug/{slug}", async (IMediator mediator, string slug) =>
        {
            try
            {
                var result = await mediator.Send(new GetPageBySlugQuery(slug));
                return Results.Ok(result);
            }
            catch (NotFoundException ex)
            {
                return Results.NotFound(ex.Message);
            }
        })
        .WithName("GetPageBySlug")
        .WithDescription("Retrieves a page by its slug");

        return app;
    }
}
