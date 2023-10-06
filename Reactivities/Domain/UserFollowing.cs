namespace Domain
{
    // This needs to be added into the AppUser entity
    public class UserFollowing
    {
        // This will be the observer
        public string ObserverId {get; set;}
        // This is the person that will follow another user
        public AppUser Observer {get; set;}
        // This will be the target observed by the observer
        public string TargetId{get; set;}
        public AppUser Target {get; set;}

    }
}