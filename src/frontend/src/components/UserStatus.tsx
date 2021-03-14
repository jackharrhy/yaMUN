import React from "react";

function UserStatus({ username }: { username?: string }) {
  let status = "Currently logged out";

  if (username !== undefined) {
    status = `Logged in as '${username}'`;
  }

  return <p className="text-xl text-center">{status}</p>;
}

export default UserStatus;
