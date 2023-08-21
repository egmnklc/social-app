using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {

            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {

            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
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
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //* Get the username
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                
                //* Create activity attendee, set isHost to true since this is a creation method
                var attendee = new ActivityAttendee{
                    AppUser = user,
                    Activity = request.Activity,
                    IsHost = true
                };
                //* Add activity attendee 
                request.Activity.Attendees.Add(attendee);

                //*  We're not accessing the database at this point. We only add the Activity in memory,
                //* not touching the database.
                _context.Activities.Add(request.Activity);

                //*  SaveChangesAsync() returns the number of entries written to the database. If 0, it's false. If > 0, then it's true,
                //* which means it has written something to the database.
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to create activity");
                //* Letting the API controller that our request has been finished.
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}