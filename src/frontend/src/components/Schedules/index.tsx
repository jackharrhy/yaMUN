import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import { useStoreActions, useStoreState } from "../../store";
import MiniScheduleViews from "./MiniScheduleView";

function Schedules() {
  const history = useHistory();

  const userSchedules = useStoreState((state) => state.usersSchedules);
  const currentSchedule = useStoreState((state) => state.currentSchedule);

  const fetchSchedules = useStoreActions((actions) => actions.fetchSchedules);

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    if (currentSchedule !== undefined) {
      history.push(`/schedules/${currentSchedule._id}`);
    }
  }, [currentSchedule]);

  return (
    <>
      <Link to="/create-schedule">
        <p className="text-sm text-center mt-1 mb-3">Create Schedule</p>
      </Link>
      <MiniScheduleViews schedules={userSchedules} />
    </>
  );
}

export default Schedules;
