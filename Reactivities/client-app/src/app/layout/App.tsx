import { Container } from "semantic-ui-react";
import Navbar from "./Navbar";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import { ToastContainer } from "react-toastify";

function App() {
  const location = useLocation();

  /*
   * When we go to activities, the outlet will be replaced with the activity dashboard and same for HomePage.
   * - Outlet replaces itself with the component to be loaded.
   */
  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <Navbar />
          <Container style={{ marginTop: "7em" }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}

/*
 * Here, the observer at the higher order function is going to return our app component with those additional
 * powers, the App component will be a Observer observing the Observables.
 */
export default observer(App);
