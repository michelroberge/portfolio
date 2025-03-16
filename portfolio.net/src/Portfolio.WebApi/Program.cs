using Portfolio.Infrastructure;
using Portfolio.WebApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services
    .AddEndpointsApiExplorer()
    .AddApplicationServices()
    .AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi();
}

app.UseHttpsRedirection();
app.UseCustomMiddleware(app.Environment);

// Configure endpoints
app.MapEndpoints();

app.Run();
