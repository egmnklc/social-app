using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application
{
    // List class is for handling Queries.
    public class List
    {
        // Query class will derieve from IRequest, which will return a List of Activities.
        public class Query : IRequest<List<Activity>> { }
        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            // This creates a Handle method that returns Task List of Acitivities.
            // - Since we're returning a Task, we need to make it async.
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Activities.ToListAsync();
            }
        }
    }
}

/*
* Overall, this is our mediator query.
* - We pass our Query which forms a request that we pass to our Handler. 
* -     Then it returns the data they we specifcy we're looking for. It's returned in the await Task.
* -     
*/