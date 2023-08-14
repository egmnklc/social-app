import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

//* Using an interface provides type safety
interface Props {
  activities: Activity[];
  selectedActivity: Activity | undefined;
  selectActivity: (id: string) => void;
  cancelSelectedActivity: () => void;
  editMode: boolean;
  openForm: (id: string) => void;
  closeForm: () => void;
  createOrEdit(activity: Activity): void;
  deleteActivity(id: string): void;
}

//*  In the parameter, what we're doing is we're destructuring the activities property itself from the
//* props itself or from the properties that we're passing down from our Activity Dashboard.
//*
//*  By doing that we allow passing down properties form parent to child, or to other
//* components in other words.

export default function ActivityDashboard({
  activities,
  selectActivity,
  selectedActivity,
  cancelSelectedActivity,
  editMode,
  openForm,
  closeForm,
  createOrEdit,
  deleteActivity,
}: Props) {
  return (
    <Grid>
      <Grid.Column width={"10"}>
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity}
        />
      </Grid.Column>
      <Grid.Column width="6">
        {/* Display the activity[0] only if there is an activity[0]
        If you get a TypeError saying Cannot read property of undefined, 
        it may be because of our component being loaded before getting
        an access to the activity object.*/}
        {selectedActivity && !editMode && (
          <ActivityDetails
            activity={selectedActivity}
            cancelSelectedActivity={cancelSelectedActivity}
            openForm={openForm}
          />
        )}
        {editMode && (
          <ActivityForm
            closeForm={closeForm}
            activity={selectedActivity}
            createOrEdit={createOrEdit}
          />
        )}
      </Grid.Column>
    </Grid>
  );
}
