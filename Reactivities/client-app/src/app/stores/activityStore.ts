import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";

export default class ActivityStore {
  // title = "Hello from MobX!";

  // activities: Activity[] = [];
  activityRegistry = new Map<String, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  //* Are we loading our components for the first time?, same as state for loading: const [loading, setLoading] = useState(true);
  loadingInitial = true;

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

  //* This is a computed property
  //! Sort activities by date
  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }



  loadActivities = async () => {
    try {
      //* Get activities from the API, loop over each, split date and mutate the state with MobX. It would have been an AntiPattern in Redux.
      const activities = await agent.Activities.list();

      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split("T")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loadingInitial = false;
      });
    }
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

  //* Moved selectedActivity from App.tsx to here.
  selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
  };

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  openForm = (id?: string) => {
    id ? this.selectActivity(id) : this.cancelSelectedActivity();
    this.editMode = true;
  };

  closeForm = () => {
    this.editMode = false;
  };

  createActivity = async (activity: Activity) => {
    this.loading = true;
    activity.id = uuid();

    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        // this.activities.push(activity);
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        //* Replace an existing activity with the updated version of it.
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
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
}
