import React from "react";

import { useStoreActions, useStoreState } from "../store";
import Box from "./Box";

function LoggedIn() {
  const username = useStoreState((state) => state.username);
  const logout = useStoreActions((actions) => actions.logout);

  const attemptLogout = () => logout();

  // TODO make the following div not full width, but centered instead.

  return (
    <div className="m-auto w-auto pt-2">
      <Box className="pt-4 pb-5 px-5">
        <p className="text-xl text-center">Logged in as '{username}'</p>
        <input
          className="w-full py-0.5 mt-4 border bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
          type="submit"
          value="Logout"
          onClick={attemptLogout}
        />
      </Box>
    </div>
  );
}

export default LoggedIn;
