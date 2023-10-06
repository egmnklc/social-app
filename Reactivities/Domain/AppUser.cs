using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName{ get; set; }  
        public string Bio { get; set; } 
        public ICollection<ActivityAttendee> Activities { get; set; }
        public ICollection<Photo> Photos { get; set; }  
        // Currently logged in user's
        public ICollection<UserFollowing> Followings {get; set;}
        // Followers of currently logged in user
        public ICollection<UserFollowing> Followers {get; set;}
    }
}