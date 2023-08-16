import { useEffect } from "react";
import { Container } from "semantic-ui-react";
import Navbar from "./Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponents from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

function App() {
  const { activityStore } = useStore();

  /*
   *  The [] (this is an empty dependency array) passed here will make useEffect to fire only once.
   * Otherwise the useEffect will update acitivites because
   * useEffect() runs for each render and the use of setActivities will trigger a render.
   *
   * Rerun the useEffect only if a change occurs in the activityStore.
   */
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponents content="Loading App" />;

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard />
      </Container>
    </>
  );
}

/*
 * Here, the observer at the higher order function is going to return our app component with those additional
 * powers, the App component will be a Observer observing the Observables.
 */
export default observer(App);
