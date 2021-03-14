import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";

import useLoginStatus from "./hooks/useLoginStatus";
import BannerTest from "./components/BannerTest";
import CreateAccount from "./components/CreateAccount";
import FindCourses from "./components/FindCourses";
import Login from "./components/Login";
import NavBar from "./components/NavBar";

export default function App() {
  const { refetch: refetchLoginStatus, error } = useLoginStatus();

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
            <Route path="/schedules">Schedule</Route>
            <Route path="/bookmarks">Bookmarks</Route>
            <Route path="/(login|create-account)">
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/create-account">
                <CreateAccount />
              </Route>
            </Route>
            <Route path="/">Home Page</Route>
          </Switch>
        </div>
      </QueryParamProvider>
    </Router>
  );
}
