import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroller";

//*  In the parameter, what we're doing is we're destructuring the activities property itself from the
//* props itself or from the properties that we're passing down from our Activity Dashboard.
//*
//*  By doing that we allow passing down properties form parent to child, or to other
//* components in other words.

export default observer(function ActivityDashboard() {
  const { activityStore } = useStore();
  const { loadActivities, activityRegistry, setPagingParams, pagination } =
    activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  function handleGetNext() {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
  }

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

  if (activityStore.loadingInitial && !loadingNext)
    return <LoadingComponent content="Loading activities..." />;

  return (
    <Grid>
      <Grid.Column width={"10"}>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={
            !loadingNext &&
            !!pagination &&
            pagination.currentPage < pagination.totalPages
          }
          initialLoad={false}
        >
          <ActivityList />
        </InfiniteScroll>
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
});
