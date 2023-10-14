import { makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {
  // title = "Hello from MobX!";

  // activities: Activity[] = [];
  activityRegistry = new Map<String, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  //* Are we loading our components for the first time?, same as state for loading: const [loading, setLoading] = useState(true);
  //* Used to distinguish the 'initial loading state' from other loading states(like updating or deleting)
  loadingInitial = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();

  constructor() {
    /*
     * `this` keyword here says this is going to be used, this function will be
     * used in this -activityStore- class
     *
     * makeAutoObservable will work out that our title is a property, therefore it should be an Observable,
     * and also work out setTitle is a function so it will be an action.
     *
     */
    makeAutoObservable(this);
  }

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  get axiosParams(){
    const params = new URLSearchParams();
    params.append('pageNumber', this.pagingParams.pageNumber.toString());
    params.append('pageSize', this.pagingParams.pageSize.toString());
    return params;
  }

  //* This is a computed property
  //! Sort activities by date
  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(new Date(activity.date!), "dd MMM yyyy");
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  loadActivities = async (  ) => {
    this.loadingInitial = true;
    try {
      //* Get activities from the API, loop over each, split date and mutate the state with MobX. It would have been an AntiPattern in Redux.
      const result = await agent.Activities.list(this.axiosParams);
      runInAction(() => {
        result.data.forEach((activity) => {
          this.setActivity(activity);
        });
        //* After we have our activities back inside our result is not just the data but the pagination as well.
        this.setPagination(result.pagination);
        this.loadingInitial = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loadingInitial = false;
      });
    }
  };

  //* Helper function to set the pagination when we load our activities.
  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  private setActivity = (activity: Activity) => {
    const user = store.userStore.user;
    //* some returns a boolean if the callback function returns true for any element of the array.
    //* If a user is going to an event and is in the attendees list, then we flag this as going.
    if (user) {
      activity.isGoing = activity.attendees!.some(
        (a) => a.username === user.username
      );
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find(
        (x) => x.username === activity.hostUsername
      );
    }

    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction(() => {
          this.selectedActivity = activity;
        });
        this.setActivity(activity);
        this.loadingInitial = false;
        return activity;
      } catch (error) {
        console.log(error);
        this.loadingInitial = false;
      }
    }
  };

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  /* We're using this keyword here so we got to bin the particular property to our class (.bound does that)
   * - When a function is bound to a class, it means that we can make use of `this` keyword to acces a property
   * inside the same class.
   * - There is another way for binding, which is to use arrow functions. Arrow functions create automatic
   * binding to the class, and we don't need to specift action.bound as in the previous point.
   */
  // setTitle = () => {
  //   this.title = this.title + "!";
  // };

  createActivity = async (activity: ActivityFormValues) => {
    activity.id = uuid();
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    const newActivity = new Activity(activity);

    newActivity.hostUsername = user!.username;
    newActivity.attendees = [attendee];

    this.setActivity(newActivity);

    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        // this.activities.push(activity);
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if (activity.id) {
          let updatedActivity = {
            ...this.getActivity(activity.id),
            ...activity,
          };
          this.activityRegistry.set(activity.id, updatedActivity as Activity);
          this.selectedActivity = updatedActivity as Activity;
        }
        //* Replace an existing activity with the updated version of it.
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        // this.activities = [...this.activities.filter((a) => a.id !== id)];
        this.activityRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees =
            this.selectedActivity.attendees?.filter(
              (a) => a.username !== user?.username
            );
          this.selectedActivity.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (err) {
      console.log(err);
    } finally {
      runInAction(() => {
        // Turn off loading flag after success/fail
        this.loading = false;
      });
    }
  };

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled =
          !this.selectedActivity?.isCancelled;
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (err) {
      console.log(err);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  updateAttendeeFollowing = (username: string) => {
    this.activityRegistry.forEach((activity) => {
      activity.attendees.forEach((attendee) => {
        if (attendee.username === username) {
          attendee.following
            ? attendee.followersCount--
            : attendee.followersCount++;
          attendee.following = !attendee.following;
        }
      });
    });
  };
}
