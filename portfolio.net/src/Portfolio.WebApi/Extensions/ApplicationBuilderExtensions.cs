using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

namespace Portfolio.WebApi.Extensions;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseCustomMiddleware(this IApplicationBuilder app, IWebHostEnvironment env)
    {

        app.UseHttpsRedirection();
        app.UseCustomExceptionHandler();

        return app;
    }

    public static IApplicationBuilder UseSwaggerWithUI(this IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        return app;
    }

    public static IApplicationBuilder UseCustomExceptionHandler(this IApplicationBuilder app)
    {
        app.UseExceptionHandler("/error");
        return app;
    }
}
