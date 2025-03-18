using Microsoft.AspNetCore.Identity;
using Portfolio.Application.Interfaces.Services;
using Portfolio.Infrastructure.Identity;

namespace Portfolio.Infrastructure.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public IdentityService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<(bool Succeeded, string UserId, IEnumerable<string> Errors)> CreateUserAsync(string userName, string email, string password)
        {
            var user = new ApplicationUser
            {
                UserName = userName,
                Email = email
            };

            var result = await _userManager.CreateAsync(user, password);

            return (result.Succeeded, user.Id, result.Errors.Select(e => e.Description));
        }

        public Task<bool> AddUserToRoleAsync(string userId, string role)
        {
            throw new NotImplementedException();
        }    
}
