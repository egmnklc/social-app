using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        // Create constructor
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        // This is going to represent the tablename we create it in the db.
        public DbSet<Activity> Activities { get; set; }
    }
}