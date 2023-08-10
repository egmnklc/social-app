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
builder.Services.AddDbContext<DataContext>(opt =>{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

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
