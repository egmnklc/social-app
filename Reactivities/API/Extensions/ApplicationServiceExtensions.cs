using Application;
using Application.Core;
using Application.Interfaces;
using Application.Photos;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    /* 
    * While creating extension methods, we need to make sure that a static class.
    * - We don't need to create a new instance of this class when we use an extension method.
    */
    public static class ApplicationServiceExtensions
    {
        //* LHS is the thing that we're extending, RHS is configuration. 
        //! By stating `this`, we're referring to where we use this method - Inside Program.cs -
        //* The config will give us acces to our appSettings.json etc.
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config)
        {
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            // Adding cors policy 
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                    .WithOrigins("http://localhost:3000");
                }
                );
            });

            /*
            * Inside the method we tell where our handlers are located.
            * - Then this Service is registered and its going to need to find our where our handlers are.
            * Because we're adding this service in our API project.  
            * - Now, when our application starts, the Service gets registered and it takes a look inside the assembly
            * where Application.List.Handler class is located, and it will register all of our Mediator Handlers,
            * so it knows where to send the notifications|activities that we're getting mediator to take care of.
            */

            /*
            ?   So now with the Mediator Pattern, the incoming request from Postman is not directly from the API controller 
            ? directly. Our API controller is sending a request via our go between mediator which is the one with 
            ? return await _mediator.Send(new Application.List.Query());. That returns the List of Activities 
            ? (the return type is Task<ActionResult<List<Activity>>>) back up via mediator to our API controller 
            ? which we then return inside of an HTTP response to the client.
            ?
            */

            // Fetch all activities
            services.AddMediatR(typeof(Application.List.Handler));
            // Make sure to register the mediator, otherwise it won't work in postman.
            // Fetch Activity with specific ID
            services.AddMediatR(typeof(API.Controllers.Details.Query));
            // Specify maapping profile to get access to the class inside our application core namespace.
            //  - .Assembly locates all of the mapping profiles that we're using inside our project.
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddFluentValidationAutoValidation();
            //  When the app starts, this service will be registers and any validators will be registered inside there
            // as well, so it's going to automatically validate for us.
            services.AddValidatorsFromAssemblyContaining<Create>();
            services.AddHttpContextAccessor();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            // Get necessary values from appSettings.json for Cloudinary
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
            services.AddSignalR();

            return services;

        }
    }
}