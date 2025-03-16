using MediatR;
using Microsoft.Extensions.DependencyInjection;
using NSwag;
using Portfolio.Application.UseCases.Pages.Commands.CreatePage;
using Portfolio.Infrastructure;

namespace Portfolio.WebApi.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddMediatR(cfg => {
            cfg.RegisterServicesFromAssembly(typeof(CreatePageCommand).Assembly);
        });

        return services;
    }

    public static IServiceCollection AddOpenApi(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddOpenApiDocument(config =>
        {
            config.Title = "Portfolio API";
            config.Version = "v1";
            config.Description = "API for managing portfolio content using Clean Architecture and DDD principles";
            
            config.DocumentName = "v1";
            config.PostProcess = document =>
            {
                document.Info.Contact = new NSwag.OpenApiContact
                {
                    Name = "Portfolio Team",
                    Email = "support@portfolio.com"
                };
            };
        });

        return services;
    }

    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddInfrastructure(configuration);
        return services;
    }
}
