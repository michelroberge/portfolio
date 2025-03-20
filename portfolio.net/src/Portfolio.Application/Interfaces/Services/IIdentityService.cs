using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portfolio.Application.Interfaces.Services
{
    public interface IIdentityService
    {
        Task<(bool Succeeded, string UserId, IEnumerable<string> Errors)> CreateUserAsync(string userName, string email, string password);
        Task<bool> AddUserToRoleAsync(string userId, string role);
    }
}
