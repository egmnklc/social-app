using Application;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        private readonly IMediator _mediator;
        public ActivitiesController(IMediator mediator)
        {
            _mediator = mediator;

        }

        // Returns a list of activities
        [HttpGet] // api/acitivites
        public async Task<IActionResult> GetActivities()
        {
            // We used Send because we need to Send this query to our Mediator Handler
            return HandleResult(await Mediator.Send(new List.Query()));
        }


        // When we make this request, it's going to go to the api/activities/id and use the id here.
        [HttpGet("{id}")]
        // Set Task type to IActionResult, it allows to return HTTP Responses
        public async Task<IActionResult> GetActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        //* Create an activity
        //! - When we use IActionResult, it gives us access to the HTTP response types such as OK, BAD REQUEST, etc.
        /* 
        *  Here, we are sending an object inside the body of a request. Notice that this ActivitiesController
        * class is inheriting/deriving from the BaseAPIController class. BaseAPI controller class has an
        * attribute named [ApiController], it means that it's smart enough to recognize that it needs to
        * look inside the body request to get this Object and it's going to compare the properties inside that
        * activity (in the function activity is the parameter name of type Activity) and if they match,
        * it will recognize that the object we've send inside the request body (activity) is indeed an Activity,
        * and look inside the body to go and get it.
        *
        *
        * There's another way to tell an API controller to look inside the request body and it's by adding
        * [FormBody] before the parameter type. Thanks to [ApiController] attribute, we don't have to perform this.
        */
        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }));
        }

        //* PUT is used for updating resources.
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            //* We'll add the id to the Activity object before we pass it to our handler.
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}