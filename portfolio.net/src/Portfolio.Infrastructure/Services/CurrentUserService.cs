using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Portfolio.Application.Interfaces.Services;
using Portfolio.Infrastructure.Identity;

namespace Portfolio.Infrastructure.Services
{
    public class CurrentUserService(
        IHttpContextAccessor httpContextAccessor,
        UserManager<ApplicationUser> userManager) : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private const string AnonymousCookieName = "AnonymousUID";

        public string UserId
        {
            get
            {
                var user = _httpContextAccessor.HttpContext?.User;
                // If user is authenticated, return their ID from Identity
                if (user?.Identity?.IsAuthenticated == true)
                {
                    return user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
                }
                // Otherwise, handle anonymous users
                return GetOrCreateAnonymousUserId();
            }
        }

        public List<string> Roles
        {
            get
            {
                var user = _httpContextAccessor.HttpContext?.User;
                return user?.Claims
                    .Where(c => c.Type == ClaimTypes.Role)
                    .Select(c => c.Value)
                    .ToList() ?? new List<string>();
            }
        }

        public bool IsAuthenticated => _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

        public async Task<bool> IsInRoleAsync(string role)
        {
            if (!IsAuthenticated) return false;

            var user = await _userManager.GetUserAsync(_httpContextAccessor.HttpContext?.User);
            if (user == null) return false;

            return await _userManager.IsInRoleAsync(user, role);
        }

        private string GetOrCreateAnonymousUserId()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null) return Guid.NewGuid().ToString();
            var requestCookies = context.Request.Cookies;
            var responseCookies = context.Response.Cookies;
            if (requestCookies.TryGetValue(AnonymousCookieName, out var anonymousId))
            {
                return anonymousId;
            }
            // Generate a new anonymous UID
            anonymousId = Guid.NewGuid().ToString();
            responseCookies.Append(AnonymousCookieName, anonymousId, new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Ensure HTTPS only
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(7) // Keep the anonymous user ID for a week
            });
            return anonymousId;
        }
    }
}