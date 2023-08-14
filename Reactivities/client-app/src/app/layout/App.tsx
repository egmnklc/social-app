import { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import Navbar from "./Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";

function App() {
  //* activities will be a set of elements of Activity type.
  const [activities, setActivities] = useState<Activity[]>([]);
  //* useState for selecting an activity from the ActivityList
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);

  /*
   *  The [] (this is an empty dependency array) passed here will make useEffect to fire only once.
   * Otherwise the useEffect will update acitivites because
   * useEffect() runs for each render and the use of setActivities will trigger a render.
   */
  useEffect(() => {
    agent.Activities.list()
      .then((response) => {
        console.log('API response:', response);
        response.forEach(activity => {
          activity.date = activity.date.split('T')[0]
        })
        setActivities(response);
      });
  }, []);

  //*  Handle the selection of an activity. In a function we'll pass down via our ActivityDashboard
  //* to our Activity.

  function handleSelectActivity(id: string) {
    /*
     * x in this case is just a variable to hold the activity, or the individual activities that
     * make up the activities array. x represents an Activcity Object and find method is going to
     * call this predicate (haber) once for each element of the array in ascending order, until
     * it finds one where the predicate returns true.
     */
    setSelectedActivity(activities.find((x) => x.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    //* If the activity we want to modify exists, find it in our actvities and update it.
    //* If it does not exist, put it in the activities array, and assign a unique id.
    activity.id
      ? setActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ])
      : setActivities([...activities, { ...activity, id: uuid() }]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter((x) => x.id !== id)]);
  }

  return (
    <>
      <Navbar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectedActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
}

export default App;
