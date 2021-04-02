import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";

import BannerTest from "./components/BannerTest";
import CreateAccount from "./components/CreateAccount";
import DisplayError from "./components/DisplayError";
import ErrorBoundary from "./components/ErrorBoundary";
import FindCourses from "./components/FindCourses";
import Home from "./components/Home";
import LoggedIn from "./components/LoggedIn";
import Login from "./components/Login";
import Schedules from "./components/Schedules";
import Create from "./components/Schedules/Create";
import ScheduleView from "./components/Schedules/ScheduleView";
import ViewBookmarks from "./components/ViewBookmarks";
import { useStoreActions, useStoreState } from "./store";

function Routes() {
  const fetchLoginStatus = useStoreActions(
    (actions) => actions.fetchLoginStatus
  );
  const fetchPossibleCourseFilters = useStoreActions(
    (actions) => actions.fetchPossibleCourseFilters
  );

  const loggedIn = useStoreState((state) => state.loggedIn);
  const fetchBookmarks = useStoreActions((actions) => actions.fetchBookmarks);

  useEffect(() => {
    fetchLoginStatus();
    fetchPossibleCourseFilters();
    fetchBookmarks();
  }, []);

  return (
    <Switch>
      <Route path="/banner-test">
        <ErrorBoundary>
          <BannerTest />
        </ErrorBoundary>
      </Route>
      <Route path="/find-courses">
        <ErrorBoundary>
          <FindCourses />
        </ErrorBoundary>
      </Route>
      <Route path="/schedules">
        <ErrorBoundary>
          {loggedIn ? (
            <>
              <Route exact path="/schedules">
                <Schedules />
              </Route>
              <Route exact path="/schedules/create">
                <Create />
              </Route>
              <Route
                path="/schedules/:scheduleId"
                children={<ScheduleView />}
              />
            </>
          ) : (
            <>
              <DisplayError error="Login required!" />
              <Login />
            </>
          )}
        </ErrorBoundary>
      </Route>
      <Route path="/bookmarks">
        <ErrorBoundary>
          {loggedIn ? (
            <ViewBookmarks />
          ) : (
            <>
              <DisplayError error="Login required!" />
              <Login />
            </>
          )}
        </ErrorBoundary>
      </Route>
      <Route path="/(login|create-account)">
        <ErrorBoundary>
          {loggedIn ? (
            <LoggedIn />
          ) : (
            <>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/create-account">
                <CreateAccount />
              </Route>
            </>
          )}
        </ErrorBoundary>
      </Route>
      <Route path="/">
        <ErrorBoundary>
          <Home />
        </ErrorBoundary>
      </Route>
    </Switch>
  );
}

export default Routes;