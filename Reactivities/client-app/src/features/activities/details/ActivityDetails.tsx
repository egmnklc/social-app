import { Button, Card, Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const {
    selectedActivity: activity,
    loadActivity,
    loadingInitial,
  } = activityStore;
  const { id } = useParams();

  useEffect(() => {
    if (id) loadActivity(id);
  }, [id, loadActivity]);



  if (loadingInitial || !activity) return <LoadingComponent />;

  return (
    //* Fluid makes a component take as much as space there's available.
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{new Date(activity.date).toLocaleDateString()}</span>
        </Card.Meta>
        <Card.Description>{activity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths="2">
          <Button as={Link} to={`/manage/${activity.id}`} basic color="blue" content="Edit" />
          {/* We don't need to declare an anonymous function here because our we're not
          using paranthesis here, this doesn't execute immidiately and will wait for the 
          button click to be executed. */}
          <Button as={Link} to={'/activities  '} basic color="blue" content="Cancel" />
        </Button.Group>
      </Card.Content>
    </Card>
  );
});
