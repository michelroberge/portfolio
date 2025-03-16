using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace Portfolio.WebApi.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddWebApiServices(this IServiceCollection services)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerDocumentation();

        return services;
    }

    private static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
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
}
