using API.Extensions;
using API.Middleware;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

/* Add services to the container.
// - Think of services as things that we use inside our application logic.
* We can add services to guve us more functionality to our logic that we create.
*/

builder.Services.AddControllers(opt => {
    //* Every single endpoint is going to require authentication now
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});
//* Add all services from the ApplicationServiceExtensions file to keep Program file clean.
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

/* Configure the HTTP request pipeline.
* - This is often referred to as middleware.
* Middleware is a thing that can do smt with the HTTP request on its way in/out.
*
* - Pipeline is often used to say that an HTTP request will go through a kind of pipeline.
* At each stage of its journey through that pipeline on its way in and on its way out, then we can do 
* things with that request.
*
*/

app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Removed this to keep things simple for now 
// app.UseHttpsRedirection();

// Addig CORS before getting to Authorization, 
app.UseCors("CorsPolicy");

//* Their order matter. 
//* Is this a valid user?
app.UseAuthentication();
//* Is the user allowed to be here?
app.UseAuthorization();

//* This is referring to our API controllers, which is the Controllers folder.
app.MapControllers();

/*
*
* What does using here means?
* - It means that when we're finished with this particular method / when we're done with this scope, 
* anything inside it will be disposed or destroyed & cleaned up from the memory.
*
*/

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during investigation");
}

app.Run();
