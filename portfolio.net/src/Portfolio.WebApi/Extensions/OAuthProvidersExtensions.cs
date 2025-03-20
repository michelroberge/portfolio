using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;

namespace Portfolio.WebApi.Extensions
{
    public static class OAuthProvidersExtensions
    {
        public static IServiceCollection AddOAuthProviders(this IServiceCollection services, IConfiguration configuration)
        {
            var authConfig = configuration.GetSection("Authentication");

            if (authConfig.GetValue<bool>("Google:Enabled"))
            {
                services.AddAuthentication().AddOAuth("Google", options =>
                {
                    options.ClientId = authConfig["Google:ClientId"]!;
                    options.ClientSecret = authConfig["Google:ClientSecret"]!;
                    options.CallbackPath = "/auth/google-callback";
                    options.AuthorizationEndpoint = "https://accounts.google.com/o/oauth2/auth";
                    options.TokenEndpoint = "https://oauth2.googleapis.com/token";
                    options.UserInformationEndpoint = "https://www.googleapis.com/oauth2/v2/userinfo";

                    options.Scope.Add("email");
                    options.Scope.Add("profile");

                    options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
                    options.ClaimActions.MapJsonKey("urn:google:picture", "picture");

                    options.SaveTokens = true;

                    options.Events.OnCreatingTicket = async context =>
                    {
                        var response = await context.Backchannel.GetAsync(context.Options.UserInformationEndpoint);
                        if (response.IsSuccessStatusCode)
                        {
                            var json = await response.Content.ReadAsStringAsync();
                            using var user = JsonDocument.Parse(json);
                            context.RunClaimActions(user.RootElement);
                        }
                    };
                });
            }

            if (authConfig.GetValue<bool>("GitHub:Enabled"))
            {
                services.AddAuthentication().AddOAuth("GitHub", options =>
                {
                    options.ClientId = authConfig["GitHub:ClientId"]!;
                    options.ClientSecret = authConfig["GitHub:ClientSecret"]!;
                    options.CallbackPath = "/auth/github-callback";
                    options.AuthorizationEndpoint = "https://github.com/login/oauth/authorize";
                    options.TokenEndpoint = "https://github.com/login/oauth/access_token";
                    options.UserInformationEndpoint = "https://api.github.com/user";

                    options.Scope.Add("user:email");

                    options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
                    options.ClaimActions.MapJsonKey("urn:github:avatar", "avatar_url");

                    options.SaveTokens = true;

                    options.Events.OnCreatingTicket = async context =>
                    {
                        var response = await context.Backchannel.GetAsync(context.Options.UserInformationEndpoint);
                        if (response.IsSuccessStatusCode)
                        {
                            var json = await response.Content.ReadAsStringAsync();
                            using var user = JsonDocument.Parse(json);
                            context.RunClaimActions(user.RootElement);
                        }
                    };
                });
            }

            return services;
        }
    }
}
