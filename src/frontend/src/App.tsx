import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";

import BannerTest from "./components/BannerTest";
import FindCourses from "./components/FindCourses";
import NavBar from "./components/NavBar";

export default function App() {
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
            <Route path="/">Home Page</Route>
          </Switch>
        </div>
      </QueryParamProvider>
    </Router>
  );
}
