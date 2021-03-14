import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";

import BannerTest from "./components/BannerTest";
import CreateAccount from "./components/CreateAccount";
import DisplayError from "./components/DisplayError";
import FindCourses from "./components/FindCourses";
import LoggedIn from "./components/LoggedIn";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import ViewBookmarks from "./components/ViewBookmarks";
import useLoginStatus from "./hooks/useLoginStatus";

export default function App() {
  const { refetch: refetchLoginStatus, error, username } = useLoginStatus();

  return (
    <Router>
      <QueryParamProvider ReactRouterRoute={Route}>
        <NavBar />
        <div id="content" className="pt-5">
          <Switch>
            <Route path="/banner-test">
              <BannerTest />
            </Route>
            <Route path="/find-courses">
              <FindCourses />
            </Route>
            <Route path="/schedules">
              {username ? (
                <p>Schedules</p>
              ) : (
                <>
                  <DisplayError error="Login required!" />
                  <Login refetchLoginStatus={refetchLoginStatus} />
                </>
              )}
            </Route>
            <Route path="/bookmarks">
              {username ? (
                <ViewBookmarks />
              ) : (
                <>
                  <DisplayError error="Login required!" />
                  <Login refetchLoginStatus={refetchLoginStatus} />
                </>
              )}
            </Route>
            <Route path="/(login|create-account)">
              {username ? (
                <LoggedIn
                  username={username}
                  refetchLoginStatus={refetchLoginStatus}
                />
              ) : (
                <>
                  <Route path="/login">
                    <Login refetchLoginStatus={refetchLoginStatus} />
                  </Route>
                  <Route path="/create-account">
                    <CreateAccount refetchLoginStatus={refetchLoginStatus} />
                  </Route>
                </>
              )}
            </Route>
            <Route path="/">Home Page</Route>
          </Switch>
        </div>
      </QueryParamProvider>
    </Router>
  );
}
