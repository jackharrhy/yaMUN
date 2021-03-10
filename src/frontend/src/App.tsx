import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import BannerTest from "./components/BannerTest";
import Home from "./components/Home";

export default function App() {
  return (
    <Router>
      <nav>
        <p>yaMUN</p>
      </nav>
      <div id="content">
        <Switch>
          <Route path="/banner-test">
            <BannerTest />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
