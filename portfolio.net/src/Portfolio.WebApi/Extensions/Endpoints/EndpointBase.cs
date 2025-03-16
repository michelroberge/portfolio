using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common.DTOs;
using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;

namespace Portfolio.WebApi.Extensions.Endpoints;

/// <summary>
/// Base class for endpoint configurations following Clean Architecture and DDD principles.
/// Provides common functionality for handling requests and responses.
/// </summary>
public static class EndpointBase
{
    /// <summary>
    /// Handles domain exceptions and returns appropriate HTTP responses
    /// </summary>
    public static IResult HandleException(Exception ex)
    {
        return ex switch
        {
            DomainValidationException validationEx => Results.BadRequest(validationEx.Message),
            NotFoundException notFoundEx => Results.NotFound(notFoundEx.Message),
            _ => Results.StatusCode(500)
        };
    }

    /// <summary>
    /// Creates a standardized endpoint group with OpenAPI documentation
    /// </summary>
    public static RouteGroupBuilder CreateGroup(IEndpointRouteBuilder app, string groupName, string tag)
    {
        return app.MapGroup($"/api/{groupName}")
            .WithTags(tag)
            .WithOpenApi();
    }

    /// <summary>
    /// Configures common CRUD endpoints for a domain entity following DDD principles
    /// </summary>
    public static RouteGroupBuilder MapCrudEndpoints<TCreateCommand, TUpdateCommand, TDeleteCommand, TGetAllQuery, TGetByIdQuery, TResponse>(
        this RouteGroupBuilder group,
        string entityName)
        where TCreateCommand : IRequest<TResponse>
        where TUpdateCommand : IRequest<TResponse>
        where TDeleteCommand : IRequest<Unit>
        where TGetAllQuery : IRequest<IEnumerable<TResponse>>
        where TGetByIdQuery : IRequest<TResponse>
        where TResponse : BaseDto
    {
        // Commands
        group.MapPost("/", async (IMediator mediator, [FromBody] TCreateCommand command) =>
        {
            try
            {
                var result = await mediator.Send(command);
                return Results.Created($"/api/{entityName.ToLower()}/{((dynamic)result).Id}", result);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        })
        .WithName($"Create{entityName}")
        .WithDescription($"Creates a new {entityName.ToLower()}");

        group.MapPut("/{id}", async (IMediator mediator, string id, [FromBody] TUpdateCommand command) =>
        {
            try
            {
                if (id != ((dynamic)command).Id?.ToString()) 
                    return Results.BadRequest("Id mismatch");
                
                var result = await mediator.Send(command);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        })
        .WithName($"Update{entityName}")
        .WithDescription($"Updates an existing {entityName.ToLower()}");

        group.MapDelete("/{id}", async (IMediator mediator, string id) =>
        {
            try
            {
                // Create delete command using reflection since we can't construct generic type
                var command = Activator.CreateInstance(typeof(TDeleteCommand), id);
                await mediator.Send(command);
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        })
        .WithName($"Delete{entityName}")
        .WithDescription($"Deletes a {entityName.ToLower()}");

        // Queries
        group.MapGet("/", async (IMediator mediator) =>
        {
            try
            {
                var query = Activator.CreateInstance<TGetAllQuery>();
                var result = await mediator.Send(query);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        })
        .WithName($"GetAll{entityName}s")
        .WithDescription($"Retrieves all {entityName.ToLower()}s");

        group.MapGet("/{id}", async (IMediator mediator, string id) =>
        {
            try
            {
                var query = Activator.CreateInstance(typeof(TGetByIdQuery), id);
                var result = await mediator.Send(query);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        })
        .WithName($"Get{entityName}ById")
        .WithDescription($"Retrieves a {entityName.ToLower()} by its ID");

        return group;
    }
}
