using Microsoft.OpenApi.Models;

namespace Portfolio.WebApi.Extensions;

public static class WebApiServiceExtensions
{
    public static IServiceCollection AddWebApiServices(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Portfolio API",
                Version = "v1",
                Description = "Portfolio API following Clean Architecture and DDD principles"
            });
        });

        return services;
    }

    public static IApplicationBuilder UseSwaggerWithUI(this IApplicationBuilder app)
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Portfolio API v1");
            c.RoutePrefix = string.Empty; // Serve Swagger UI at the root URL
        });

        return app;
    }
}
