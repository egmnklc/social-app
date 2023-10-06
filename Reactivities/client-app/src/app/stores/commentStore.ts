import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore{  
    comments: ChatComment[] = []; 
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        //* Check if we have an activity
        if (store.activityStore.selectedActivity){
            this.hubConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5000/chat?activityId=" + activityId, {
                //* Token passed here
                accessTokenFactory: ()  => store.userStore.user?.token as string
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
            //* Start the connection and log the error if connection fails.
            this.hubConnection.start().catch(error =>  console.log("Error establishing the connection: ", error))
     
            //* Recieve all comments of the activity that we're connected to.
            this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
                runInAction(() => {
                    comments.forEach(comment =>  {
                        comment.createdAt = new Date(comment.createdAt + "Z");
                    })
                    this.comments = comments
                });
            });

            //* Here comments are coming from the SignalR hub, and not from the database.
            this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt)
                    //* Unshift will place the new element at the front of the array.
                    this.comments.unshift(comment)
                });
            });
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log("Error stopping connection", error));
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: {body: string, activityId?: string}) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try{
            await this.hubConnection?.invoke('SendComment', values);
        } catch (error) {
            console.log(error);
        }
    }
}