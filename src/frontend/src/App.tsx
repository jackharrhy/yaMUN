import { StoreProvider } from "easy-peasy";
import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";

import Routes from "./Routes";
import NavBar from "./components/NavBar";
import { store } from "./store";

export default function App() {
  return (
    <StoreProvider store={store}>
      <Toaster />
      <Router>
        <QueryParamProvider ReactRouterRoute={Route}>
          <NavBar />
          <div id="content" className="pt-5">
            <Routes />
          </div>
        </QueryParamProvider>
      </Router>
    </StoreProvider>
  );
}
