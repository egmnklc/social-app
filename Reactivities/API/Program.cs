using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

/* Add services to the container.
// - Think of services as things that we use inside our application logic.
* We can add services to guve us more functionality to our logic that we create.
*/

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
// Adding cors policy 
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
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
builder.Services.AddMediatR(typeof(Application.List.Handler));
// Make sure to register the mediator, otherwise it won't work in postman.
// Fetch Activity with specific ID
builder.Services.AddMediatR(typeof(API.Controllers.Details.Query));


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
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Removed this to keep things simple for now 
// app.UseHttpsRedirection();

// Addig CORS before getting to Authorization, 
app.UseCors("CorsPolicy");

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
    await context.Database.MigrateAsync();
    await Seed.SeedData(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during investigation");
}

app.Run();
