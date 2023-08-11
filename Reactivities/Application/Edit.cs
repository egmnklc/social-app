using Domain;
using MediatR;
using Persistence;

namespace Application
{
    public class Edit
    {
        public class Command : IRequest
        {
            //* For Activity, we use Domain to bring in the using statement for the Activity.
            public Activity Activity { get; set; }

            public class Handler : IRequestHandler<Command>
            {
                private readonly DataContext _context;

                public Handler(DataContext context)
                {
                    _context = context;

                }

                public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                {
                    var activity = await _context.Activities.FindAsync(request.Activity.Id);

                    /*
                    *   The user may or may not have updated th activity title and they may or may not be
                    * sending up this particular property with the request. For example they may simply edit 
                    * any other property other than Title, and we need to be able to handle that as well.
                    * 
                    */
                    //? ?? operator is known as the null coalescing operator. 
                    
                    
                    //? We can to this for every single property but there's a shorter way to do so.      
                    activity.Title = request.Activity.Title ?? activity.Title;

                    await _context.SaveChangesAsync();

                    return Unit.Value;

                }
            }
        }
    }
}