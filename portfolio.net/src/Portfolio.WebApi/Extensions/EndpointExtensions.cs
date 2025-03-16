using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.UseCases.Blogs.Commands.CreateBlog;
using Portfolio.Application.UseCases.Blogs.Commands.DeleteBlog;
using Portfolio.Application.UseCases.Blogs.Commands.UpdateBlog;
using Portfolio.Application.UseCases.Blogs.Queries.GetAllBlogs;
using Portfolio.Application.UseCases.Blogs.Queries.GetBlogById;
using Portfolio.Application.UseCases.Blogs.Queries.GetBlogBySlug;
using Portfolio.Application.UseCases.Pages.Commands.CreatePage;
using Portfolio.Application.UseCases.Pages.Commands.DeletePage;
using Portfolio.Application.UseCases.Pages.Commands.UpdatePage;
using Portfolio.Application.UseCases.Pages.Queries.GetAllPages;
using Portfolio.Application.UseCases.Pages.Queries.GetPageById;
using Portfolio.Application.UseCases.Pages.Queries.GetPageBySlug;
using Portfolio.Application.UseCases.Projects.Commands.CreateProject;
using Portfolio.Application.UseCases.Projects.Commands.DeleteProject;
using Portfolio.Application.UseCases.Projects.Commands.UpdateProject;
using Portfolio.Application.UseCases.Projects.Queries.GetAllProjects;
using Portfolio.Application.UseCases.Projects.Queries.GetProjectById;
using Portfolio.Application.UseCases.Projects.Queries.GetProjectBySlug;
using Portfolio.Application.UseCases.Users.Commands.CreateUser;
using Portfolio.Application.UseCases.Users.Commands.DeleteUser;
using Portfolio.Application.UseCases.Users.Commands.UpdateUser;
using Portfolio.Application.UseCases.Users.Queries.GetAllUsers;
using Portfolio.Application.UseCases.Users.Queries.GetUserById;
using Portfolio.Application.UseCases.Users.Queries.GetUserByUsername;
using Portfolio.WebApi.Extensions.Endpoints;

namespace Portfolio.WebApi.Extensions;

/// <summary>
/// Provides endpoint configuration extensions following Clean Architecture principles.
/// Each domain entity has its own dedicated endpoint configuration class.
/// </summary>
public static class EndpointExtensions
{
    /// <summary>
    /// Maps all API endpoints following Clean Architecture and DDD principles.
    /// </summary>
    public static WebApplication MapEndpoints(this WebApplication app)
    {
        app.MapPageEndpoints();
        app.MapBlogEndpoints();
        app.MapProjectEndpoints();
        app.MapUserEndpoints();
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
                return Results.Created($"/api/pages/{result.Id}", result);
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

        pages.MapPut("/{id}", async (IMediator mediator, string id, [FromBody] UpdatePageCommand command) =>
        {
            try 
            {
                if (id != command.Id) return Results.BadRequest("Id mismatch");
                var result = await mediator.Send(command);
                return Results.Ok(result);
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

        pages.MapDelete("/{id}", async (IMediator mediator, string id) =>
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

        pages.MapGet("/{id}", async (IMediator mediator, string id) =>
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

    private static IEndpointRouteBuilder MapBlogEndpoints(this IEndpointRouteBuilder app)
    {
        var blogs = app.MapGroup("/api/blogs")
            .WithTags("Blogs")
            .WithOpenApi();

        // TODO: Add blog endpoints following Clean Architecture and DDD principles
        blogs.MapGet("/", () => Results.StatusCode(501))
            .WithName("GetAllBlogs")
            .WithDescription("Retrieves all blogs");

        return app;
    }

    private static IEndpointRouteBuilder MapProjectEndpoints(this IEndpointRouteBuilder app)
    {
        var projects = app.MapGroup("/api/projects")
            .WithTags("Projects")
            .WithOpenApi();

        // TODO: Add project endpoints following Clean Architecture and DDD principles
        projects.MapGet("/", () => Results.StatusCode(501))
            .WithName("GetAllProjects")
            .WithDescription("Retrieves all projects");

        return app;
    }

    private static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var users = app.MapGroup("/api/users")
            .WithTags("Users")
            .WithOpenApi();

        // TODO: Add user endpoints following Clean Architecture and DDD principles
        users.MapGet("/", () => Results.StatusCode(501))
            .WithName("GetAllUsers")
            .WithDescription("Retrieves all users");

        return app;
    }
}
