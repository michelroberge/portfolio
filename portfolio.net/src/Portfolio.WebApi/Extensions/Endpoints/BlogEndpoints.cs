using MediatR;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.UseCases.Blogs.Commands.CreateBlog;
using Portfolio.Application.UseCases.Blogs.Commands.DeleteBlog;
using Portfolio.Application.UseCases.Blogs.Commands.UpdateBlog;
using Portfolio.Application.UseCases.Blogs.Queries.GetAllBlogs;
using Portfolio.Application.UseCases.Blogs.Queries.GetBlogById;
using Portfolio.Application.UseCases.Blogs.Queries.GetBlogBySlug;

namespace Portfolio.WebApi.Extensions.Endpoints;

public static class BlogEndpoints
{
    public static IEndpointRouteBuilder MapBlogEndpoints(this IEndpointRouteBuilder app)
    {
        var blogs = app.MapGroup("/api/blogs")
            .WithTags("Blogs")
            .WithOpenApi();

        // Commands
        blogs.MapPost("/", async (IMediator mediator, [FromBody] CreateBlogCommand command) =>
        {
            try
            {
                var result = await mediator.Send(command);
                return Results.Created($"/api/blogs/{result.Id}", result);
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("CreateBlog")
        .WithDescription("Creates a new blog post");

        blogs.MapPut("/{id}", async (IMediator mediator, string id, [FromBody] UpdateBlogCommand command) =>
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
        .WithName("UpdateBlog")
        .WithDescription("Updates an existing blog post");

        blogs.MapDelete("/{id}", async (IMediator mediator, string id) =>
        {
            try
            {
                await mediator.Send(new DeleteBlogCommand(id));
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("DeleteBlog")
        .WithDescription("Deletes a blog post");

        // Queries
        blogs.MapGet("/", async (IMediator mediator) =>
        {
            try
            {
                var result = await mediator.Send(new GetAllBlogsQuery());
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("GetAllBlogs")
        .WithDescription("Retrieves all blog posts");

        blogs.MapGet("/{id}", async (IMediator mediator, string id) =>
        {
            try
            {
                var result = await mediator.Send(new GetBlogByIdQuery(id));
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("GetBlogById")
        .WithDescription("Retrieves a blog post by its ID");

        blogs.MapGet("/by-slug/{slug}", async (IMediator mediator, string slug) =>
        {
            try
            {
                var result = await mediator.Send(new GetBlogBySlugQuery(slug));
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("GetBlogBySlug")
        .WithDescription("Retrieves a blog post by its slug");

        return app;
    }
}
