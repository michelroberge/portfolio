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

}
