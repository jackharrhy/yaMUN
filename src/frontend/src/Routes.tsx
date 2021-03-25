import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";

import BannerTest from "./components/BannerTest";
import CreateAccount from "./components/CreateAccount";
import DisplayError from "./components/DisplayError";
import FindCourses from "./components/FindCourses";
import LoggedIn from "./components/LoggedIn";
import Login from "./components/Login";
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
        <BannerTest />
      </Route>
      <Route path="/find-courses">
        <FindCourses />
      </Route>
      <Route path="/schedules">
        {loggedIn ? (
          <p>Schedules</p>
        ) : (
          <>
            <DisplayError error="Login required!" />
            <Login />
          </>
        )}
      </Route>
      <Route path="/bookmarks">
        {loggedIn ? (
          <ViewBookmarks />
        ) : (
          <>
            <DisplayError error="Login required!" />
            <Login />
          </>
        )}
      </Route>
      <Route path="/(login|create-account)">
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
      </Route>
      <Route path="/">Home Page</Route>
    </Switch>
  );
}

export default Routes;
