using MediatR;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.UseCases.Users.Commands.CreateUser;
using Portfolio.Application.UseCases.Users.Commands.DeleteUser;
using Portfolio.Application.UseCases.Users.Commands.UpdateUser;
using Portfolio.Application.UseCases.Users.Queries.GetAllUsers;
using Portfolio.Application.UseCases.Users.Queries.GetUserById;
using Portfolio.Application.UseCases.Users.Queries.GetUserByUsername;

namespace Portfolio.WebApi.Extensions.Endpoints;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var users = app.MapGroup("/api/users")
            .WithTags("Users")
            .WithOpenApi();

        // Commands
        users.MapPost("/", async (IMediator mediator, [FromBody] CreateUserCommand command) =>
        {
            try
            {
                var result = await mediator.Send(command);
                return Results.Created($"/api/users/{result.Id}", result);
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("CreateUser")
        .WithDescription("Creates a new user");

        users.MapPut("/{id}", async (IMediator mediator, string id, [FromBody] UpdateUserCommand command) =>
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
        .WithName("UpdateUser")
        .WithDescription("Updates an existing user");

        users.MapDelete("/{id}", async (IMediator mediator, string id) =>
        {
            try
            {
                await mediator.Send(new DeleteUserCommand(id));
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("DeleteUser")
        .WithDescription("Deletes a user");

        // Queries
        users.MapGet("/", async (IMediator mediator) =>
        {
            try
            {
                var result = await mediator.Send(new GetAllUsersQuery());
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("GetAllUsers")
        .WithDescription("Retrieves all users");

        users.MapGet("/{id}", async (IMediator mediator, string id) =>
        {
            try
            {
                var result = await mediator.Send(new GetUserByIdQuery(id));
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("GetUserById")
        .WithDescription("Retrieves a user by their ID");

        users.MapGet("/by-username/{username}", async (IMediator mediator, string username) =>
        {
            try
            {
                var result = await mediator.Send(new GetUserByUsernameQuery(username));
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return BaseEndpoints.HandleException(ex);
            }
        })
        .WithName("GetUserByUsername")
        .WithDescription("Retrieves a user by their username");

        return app;
    }
}
