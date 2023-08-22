import { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity, ActivityFormValues } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "./MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "./MyDateInput";
import { v4 as uuid } from "uuid";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const {
    selectedActivity,
    createActivity,
    updateActivity,
    loading,
    loadActivity,
    loadingInitial,
  } = activityStore;

  const { id } = useParams();
  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues())

  const validationSchemea = Yup.object({
    title: Yup.string().required("The activity title is required"),
    description: Yup.string().required("The activity description is required"),
    category: Yup.string().required(),
    date: Yup.string().required(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(new ActivityFormValues(activity)));
  }, [id, loadActivity]);

  // If activity id exists, update current activity. If not, create that activity.
  function handleFormSubmit(activity: ActivityFormValues) {
    if (!activity.id) {
      activity.id = uuid();
      createActivity(activity).then(() => {
        navigate(`/activities/${activity.id}`);
      });
    } else {
      updateActivity(activity).then(() => {
        navigate(`/activities/${activity.id}`);
      });
    }
  }

  // function handleChange(
  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) {
  //   const { name, value } = event.target;
  //   //* Target the property that matches this name, which is the title in this case.
  //   //* Square bracker notation specifies property with the key of name should be set to the value of this
  //   //* input element.
  //   setActivity({ ...activity, [name]: value });
  // }

  if (loadingInitial) return <LoadingComponent content="Loading Activity..." />;

  return (
    //*  Clearing clears any previous floats inside our HTML, typically resolves
    //* overflowing issues.
    //* enableReinitialize allows displaying the initial value of the form if it is already there. We have it due to useEffect.
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        validationSchema={validationSchemea}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="Title" />
            <MyTextArea rows={3} placeholder="Description" name="description" />
            <MySelectInput
              options={categoryOptions}
              placeholder="Category"
              name="category"
            />
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm: aa"
            />
            <Header content="Location Details" sub color="teal" />
            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={isSubmitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              as={Link}
              to={"/activities"}
              floated="right"
              type="submit"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
