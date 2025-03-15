using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Application.Common.Behaviors;

namespace Portfolio.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        // Add AutoMapper
        services.AddAutoMapper(assembly);

        // Add FluentValidation
        services.AddValidatorsFromAssembly(assembly);

        // Add MediatR with behaviors
        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(assembly);

            // Add pipeline behaviors in the correct order
            // 1. Logging - Should be first to capture timing for the entire pipeline
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));

            // 2. Performance - Should run after logging to track performance accurately
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehavior<,>));

            // 3. Validation - Should run after performance tracking but before transaction handling
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

            // 4. Transaction - Should run after validation but before the actual handler
            // This ensures we only start a transaction if validation passes
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));
        });

        return services;
    }
}
