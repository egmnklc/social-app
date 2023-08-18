using Domain;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
        {
            //* Add identity causes redirection issues so we use core
            services.AddIdentityCore<AppUser>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;
                //* AddEntityFrameworkStores allows querying users in the EF Store or our database
            }).AddEntityFrameworkStores<DataContext>();
            services.AddAuthentication();

            return services;
        }
    }
}