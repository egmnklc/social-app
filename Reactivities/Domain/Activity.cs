namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public bool isCancelled { get; set; }
        //* 'new' will make sure that we don't get a null reference when we try and add somethig to this collection
        public ICollection<ActivityAttendee> Attendees{ get; set; }  = new List<ActivityAttendee>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        
    }
}
