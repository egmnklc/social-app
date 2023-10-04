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
                runInAction(() => this.comments = comments);
            });

            this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
                runInAction(() => this.comments.push(comment));
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
}