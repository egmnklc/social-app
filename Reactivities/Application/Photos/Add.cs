using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            //* The naming 'File' is really important. It needs to have the same name as Key value in Postman for Add Photo request.
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _context = context;
            }


            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Get user from db. Only the currently logged in user can add a photo to that user's photos collection.

                var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                // If adding a photo fails, the AddPhoto will throw an exception.
                var photoUploadResult = await _photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId,
                };

                // Check if user already has photos that are set to main. If not, then this is the first photo and set it as main.
                if (!user.Photos.Any(x => x.IsMain))
                {
                    photo.IsMain = true;
                }
                // Add photo to user's photo colletion
                user.Photos.Add(photo);

                var result = await _context.SaveChangesAsync() > 0;

                if(result) return Result<Photo>.Success(photo);

                return Result<Photo>.Failure("Problem addding photo");

            }
        }
    }
}