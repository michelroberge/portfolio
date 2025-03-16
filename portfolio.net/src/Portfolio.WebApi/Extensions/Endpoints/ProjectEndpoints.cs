using MediatR;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.UseCases.Projects.Commands.CreateProject;
using Portfolio.Application.UseCases.Projects.Commands.DeleteProject;
using Portfolio.Application.UseCases.Projects.Commands.UpdateProject;
using Portfolio.Application.UseCases.Projects.Queries.GetAllProjects;
using Portfolio.Application.UseCases.Projects.Queries.GetProjectById;
using Portfolio.Application.UseCases.Projects.Queries.GetProjectBySlug;

namespace Portfolio.WebApi.Extensions.Endpoints;

public static class ProjectEndpoints
{
    public static IEndpointRouteBuilder MapProjectEndpoints(this IEndpointRouteBuilder app)
    {
        var projects = app.MapGroup("/api/projects")
            .WithTags("Projects")
            .WithOpenApi();

        // Commands
        projects.MapPost("/", async (IMediator mediator, [FromBody] CreateProjectCommand command) =>
        {
            try
            {
                var result = await mediator.Send(command);
                return Results.Created($"/api/projects/{result.Id}", result);
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("CreateProject")
        .WithDescription("Creates a new project");

        projects.MapPut("/{id}", async (IMediator mediator, string id, [FromBody] UpdateProjectCommand command) =>
        {
            try 
            {
                if (id != command.Id) return Results.BadRequest("Id mismatch");
                var result = await mediator.Send(command);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("UpdateProject")
        .WithDescription("Updates an existing project");

        projects.MapDelete("/{id}", async (IMediator mediator, string id) =>
        {
            try
            {
                await mediator.Send(new DeleteProjectCommand(id));
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("DeleteProject")
        .WithDescription("Deletes a project");

        // Queries
        projects.MapGet("/", async (IMediator mediator) =>
        {
            try
            {
                var result = await mediator.Send(new GetAllProjectsQuery());
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("GetAllProjects")
        .WithDescription("Retrieves all projects");

        projects.MapGet("/{id}", async (IMediator mediator, string id) =>
        {
            try
            {
                var result = await mediator.Send(new GetProjectByIdQuery(id));
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("GetProjectById")
        .WithDescription("Retrieves a project by its ID");

        projects.MapGet("/by-slug/{slug}", async (IMediator mediator, string slug) =>
        {
            try
            {
                var result = await mediator.Send(new GetProjectBySlugQuery(slug));
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("GetProjectBySlug")
        .WithDescription("Retrieves a project by its slug");

        return app;
    }
}
