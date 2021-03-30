import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { useStoreActions, useStoreState } from "../../store";
import View from "./View";

function Schedules() {
  const userSchedules = useStoreState((state) => state.usersSchedules);

  const fetchSchedules = useStoreActions((actions) => actions.fetchSchedules);

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <>
      <Link to="/schedules/create">
        <p className="text-sm text-center mt-1 mb-3">Create Schedule</p>
      </Link>
      <View schedules={userSchedules} />
    </>
  );
}

export default Schedules;
