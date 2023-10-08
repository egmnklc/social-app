using Application;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class Details
    {
        // Query class will be fetching data only, not update.
        public class Query : IRequest<Result<ActivityDto>>
        {
            public Guid Id { get; set; }
            public class Handler : IRequestHandler<Query, Result<ActivityDto>>
            {
                private readonly DataContext _context;
                private readonly IMapper _mapper;
                private readonly IUserAccessor _userAccessor;
                public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
                {
                    _userAccessor = userAccessor;
                    _mapper = mapper;
                    _context = context;

                }

                public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
                {
                    //* FindAsync does not work with projection. Used FirstOrDefaultAsync.
                    var activity = await _context.Activities.ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
                        new {currentUser = _userAccessor.GetUsername()})
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                    return Result<ActivityDto>.Success(activity);
                }
            }
        }
    }
}