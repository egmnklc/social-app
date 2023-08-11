using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
            private readonly ILogger<List> _logger;

            public Handler(DataContext context, ILogger<List> logger)
            {
                _logger = logger;
                _context = context;
            }

            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                // // We'll add some slowness to our request
                // try
                // {
                //     for (var i = 0; i < 10; i++){
                //         // Check if request is cancelled and throw if so
                //         cancellationToken.ThrowIfCancellationRequested();
                //         // If request continues,
                //         await Task.Delay(1000, cancellationToken);
                //         _logger.LogInformation($"Task {i} has completed");
                //     }
                // }
                // catch (System.Exception)
                // {
                //     // Catch thrown error here
                //     _logger.LogInformation($"Task was cancelled");
                // }

                //* If request makes through, return requested activities as normal. 
                return await _context.Activities.ToListAsync();

                //!  NOTE: We need to pass the CancellationToken to Handler in Activities controller and pass it as
                //! a parameter in HttpGet as CancellactionToken ct and add into return.
                //! We won't be using CancellationTokens for now.
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