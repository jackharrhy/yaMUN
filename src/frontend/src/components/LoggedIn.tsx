import React from "react";

import { API_BASE } from "../api";
import Box from "./Box";

function LoggedIn({
  username,
  refetchLoginStatus,
}: {
  username?: string;
  refetchLoginStatus: () => void;
}) {
  if (username === undefined) {
    return null;
  }

  const status = `Logged in as '${username}'`;

  const logout = () => {
    fetch(`${API_BASE}/logout`).then(async (resp) => {
      if (resp.ok) {
        refetchLoginStatus();
      } else {
        throw new Error("failed to logout");
      }
    });
  };

  return (
    <div className="m-auto w-auto pt-2">
      <Box className="pt-4 pb-5 px-5">
        <p className="text-xl text-center">{status}</p>
        <input
          className="w-full py-0.5 mt-4 border bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
          type="submit"
          value="Logout"
          onClick={logout}
        />
      </Box>
    </div>
  );
}

export default LoggedIn;
