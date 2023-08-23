using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        //* Create constructor
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        //* This is going to represent the tablename we create it in the db.
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        //* Create photos table
        public DbSet<Photo> Photos {get; set; } 


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            //* Primary key props, form the primary key for our table
            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.AppUserId, aa.ActivityId }));

            //* Config for our many-to-many relationship
            builder.Entity<ActivityAttendee>()
            .HasOne(u => u.AppUser)
            .WithMany(a => a.Activities)
            .HasForeignKey(aa => aa.AppUserId);

            builder.Entity<ActivityAttendee>()
            .HasOne(u => u.Activity)
            .WithMany(a => a.Attendees)
            .HasForeignKey(aa => aa.ActivityId);
        }
    }
}