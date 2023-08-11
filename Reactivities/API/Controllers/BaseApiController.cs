using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] //localhost:5000/weatherforecast
    // Added ControllerBase here
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        // ??= means if the statement beforehand is null
        //* We'll populate _mediator with the Mediator service.
        protected IMediator Mediator => _mediator ??=
            HttpContext.RequestServices.GetService<IMediator>();
    }
}