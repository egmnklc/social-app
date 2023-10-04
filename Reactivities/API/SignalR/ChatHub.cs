using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        public IMediator _mediator { get; }
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

        // Here, group is what matches the activity id, and each activity will have its own group.  
        await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment.Value);

        // When a client connects to our hub, we want them to join in a group.
        //  To do that we can use the unconnected method inside our hub so we can do smt when a client connects.
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext =  Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"];

            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

            var result = await _mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)});

            //  Send this to the person making this request trying to connect to our SignalR hub.
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        /*
                We don't need to do anything when we disconnect, because SignalR is going to remove any
            connection IDs from any groups that connection ID belongs to. So it automatically removes 
            this client or this connection ID from any groups. We only need to do this while connecting.
        */
        }
    }
}