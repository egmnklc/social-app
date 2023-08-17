import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";

//*  In the parameter, what we're doing is we're destructuring the activities property itself from the
//* props itself or from the properties that we're passing down from our Activity Dashboard.
//*
//*  By doing that we allow passing down properties form parent to child, or to other
//* components in other words.

export default observer(function ActivityDashboard() {
  const { activityStore } = useStore();
  const {loadActivities, activityRegistry} = activityStore;

  /*
   *  The [] (this is an empty dependency array) passed here will make useEffect to fire only once.
   * Otherwise the useEffect will update acitivites because
   * useEffect() runs for each render and the use of setActivities will trigger a render.
   *
   * Rerun the useEffect only if a change occurs in the activityStore.
   */
  useEffect(() => {
    if (activityRegistry.size <= 1) loadActivities();
  }, [loadActivities, activityRegistry]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading App" />;

  return (
    <Grid>
      <Grid.Column width={"10"}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width="6">
        <h2>Activity Filters</h2>
      </Grid.Column>
    </Grid>
  );
});
