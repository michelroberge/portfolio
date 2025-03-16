using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Portfolio.Application;
using Portfolio.Infrastructure;
using Portfolio.WebApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container following Clean Architecture layers
builder.Services
    .AddApplication()           // Application layer services (MediatR, AutoMapper, Validation)
    .AddInfrastructureServices(builder.Configuration) // Infrastructure layer services (EF Core, PostgreSQL)
    .AddWebApiServices();        // API layer services (Controllers, Swagger)

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerWithUI();
}

app.UseCustomExceptionHandler();
app.UseHttpsRedirection();
app.UseAuthorization();

// Configure endpoints using our fluent API
app.MapEndpoints();

app.Run();
