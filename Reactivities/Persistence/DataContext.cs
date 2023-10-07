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
        public DbSet<Comment> Comments { get; set; }    
        //* Create photos table
        public DbSet<Photo> Photos {get; set; } 
        //* We've recently added this, and will configure this in the OnModelCreating method.
        public DbSet<UserFollowing> UserFollowings {get; set;}


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

            builder.Entity<Comment>()
            .HasOne(a => a.Activity)
            .WithMany(c => c.Comments)
            .OnDelete(DeleteBehavior.Cascade);
            //*  Cascade delete behavior will delete related entities' too. For example if a user is deleted,
            //* then the comments of that user will be also deleted.

            builder.Entity<UserFollowing>(b => {
                b.HasKey(k => new {k.ObserverId, k.TargetId});

                //* Creating the observer table
                b.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    //* Cascade setting: When an a primary entity is deleted, related entities are also deleted
                    .OnDelete(DeleteBehavior.Cascade);

                //* Creating the target table
                b.HasOne(o => o.Target)
                    .WithMany(f => f.Followers)
                    .HasForeignKey(o => o.TargetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}