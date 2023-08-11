using Domain;
using MediatR;
using Persistence;

namespace Application
{
    public class Create
    {
        public class Command : IRequest
        {

            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }
            /*
            * Commands do not return anything but in this case we're returning a Task of type Unit.
            * - Unit is an Object that the Mediator provides but doesn't really have any actual value.
            * similar to returning nothing. 
            ! But it does tell our API that our request has finished so it can move on.
            * Process is like this
            * - When we use Mediator.Send(), we're waiting for that to finish inside our API controllers.
            * so we do need to return, so that the API controller is aware that the action is completed.
            
            */
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                //*  We're not accessing the database at this point. We only add the Activity in memory,
                //* not touching the database.
                _context.Activities.Add(request.Activity);

                await _context.SaveChangesAsync();

                //* Letting the API controller that our request has been finished.
                return Unit.Value;
            }
        }
    }
}