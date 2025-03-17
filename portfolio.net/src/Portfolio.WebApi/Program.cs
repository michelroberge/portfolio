using Microsoft.EntityFrameworkCore;
using Portfolio.Application;
using Portfolio.Infrastructure.DependencyInjection;
using Portfolio.Infrastructure.Persistence;
using Portfolio.WebApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container following Clean Architecture layers
builder.Services
    .AddApplication()           // Application layer services (MediatR, AutoMapper, Validation)
    .AddInfrastructureServices(builder.Configuration) // Infrastructure layer services
    .AddWebApiServices();        // API layer services (Controllers, Swagger)


builder.Services.AddCustomAuthentication();  
builder.Services.AddOAuthProviders(builder.Configuration);
builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate(); 
}

// Configure the HTTP request pipeline
app.UseCustomExceptionHandler();
app.UseHttpsRedirection();
app.UseAuthorization();

app.UseSwaggerWithUI();

// Configure endpoints using our fluent API
app.MapEndpoints();

app.Run();
