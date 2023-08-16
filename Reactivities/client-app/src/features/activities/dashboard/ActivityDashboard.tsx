import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

//*  In the parameter, what we're doing is we're destructuring the activities property itself from the
//* props itself or from the properties that we're passing down from our Activity Dashboard.
//*
//*  By doing that we allow passing down properties form parent to child, or to other
//* components in other words.

export default observer(function ActivityDashboard() {
  const { activityStore } = useStore();
  const { selectedActivity, editMode } = activityStore;

  return (
    <Grid>
      <Grid.Column width={"10"}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width="6">
        {/* Display the activity[0] only if there is an activity[0]
        If you get a TypeError saying Cannot read property of undefined, 
        it may be because of our component being loaded before getting
        an access to the activity object.*/}
        {selectedActivity && !editMode && <ActivityDetails />}
        {editMode && <ActivityForm />}
      </Grid.Column>
    </Grid>
  );
});
