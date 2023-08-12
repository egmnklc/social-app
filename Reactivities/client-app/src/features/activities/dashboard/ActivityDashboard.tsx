import React from "react";
import { Grid, List } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";

//* Using an interface provides type safety
interface Props {
  activities: Activity[];
}

//*  In the parameter, what we're doing is we're destructuring the activities property itself from the
//* props itself or from the properties that we're passing down from our Activity Dashboard.
//*
//*  By doing that we allow passing down properties form parent to child, or to other
//* components in other words.

export default function ActivityDashboard({ activities }: Props) {
  return (
    <Grid>
      <Grid.Column width={"10"}>
        <ActivityList activities={activities} />
      </Grid.Column>
    </Grid>
  );
}
