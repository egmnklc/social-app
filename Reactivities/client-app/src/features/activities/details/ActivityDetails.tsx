import { Button, Card, Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default function ActivityDetails() {
  const { activityStore } = useStore();
  const {
    selectedActivity: activity,
    openForm,
    cancelSelectedActivity,
  } = activityStore;

  if (!activity) return <LoadingComponent />;

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
          <Button
            onClick={() => openForm(activity.id)}
            basic
            color="blue"
            content="Edit"
          />
          {/* We don't need to declare an anonymous function here because our we're not
          using paranthesis here, this doesn't execute immidiately and will wait for the 
          button click to be executed. */}
          <Button
            onClick={cancelSelectedActivity}
            basic
            color="blue"
            content="Cancel"
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
}
