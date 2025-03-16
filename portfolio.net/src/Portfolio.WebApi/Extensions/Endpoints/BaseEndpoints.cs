using Microsoft.AspNetCore.Mvc;
using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;

namespace Portfolio.WebApi.Extensions.Endpoints;

public static class BaseEndpoints
{
    public static IResult HandleException(Exception ex)
    {
        return ex switch
        {
            DomainValidationException validationEx => Results.BadRequest(validationEx.Message),
            NotFoundException notFoundEx => Results.NotFound(notFoundEx.Message),
            _ => Results.StatusCode(500)
        };
    }
}
