using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        // Create constructor
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        // This is going to represent the tablename we create it in the db.
        public DbSet<Activity> Activities { get; set; }
    }
}