import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import BannerTest from "./components/BannerTest";

export default function App() {
  return (
    <Router>
      <nav className="flex items-center pl-3.5 shadow-md bg-red-500">
        <div className="pr-10">
          <Link
            to="/"
            className="text-3xl leading-6 text-white font-bold hover:text-gray-200"
          >
            yaMUN
          </Link>
        </div>
        <ul className="flex items-center justify-between text-base">
          <li>
            <Link
              to="/find-courses"
              className="mr-6 p-4 py-3 px-0 block font-semibold text-white hover:text-gray-200"
            >
              Find Courses
            </Link>
          </li>
          <li>
            <Link
              to="/schedules"
              className="mr-6 p-4 py-3 px-0 block font-semibold text-white hover:text-gray-200"
            >
              Schedules
            </Link>
          </li>
          <li>
            <Link
              to="/bookmarks"
              className="mr-6 p-4 py-3 px-0 block font-semibold text-white hover:text-gray-200"
            >
              Bookmarks
            </Link>
          </li>
        </ul>
      </nav>
      <div id="content">
        <Switch>
          <Route path="/banner-test">
            <BannerTest />
          </Route>
          <Route path="/find-courses">Find courses</Route>
          <Route path="/schedules">Schedule</Route>
          <Route path="/bookmarks">Bookmarks</Route>
          <Route path="/">Home Page</Route>
        </Switch>
      </div>
    </Router>
  );
}
