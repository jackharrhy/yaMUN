import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useStoreActions, useStoreState } from "../../../store";
import DisplaySchedule from "./DisplaySchedule";

interface IFullScheduleViewParams {
  scheduleId: string;
}

function ScheduleView() {
  const { scheduleId } = useParams<IFullScheduleViewParams>();

  const currentSchedule = useStoreState((state) => state.currentSchedule);
  const fetchNewCurrentSchedule = useStoreActions(
    (actions) => actions.fetchNewCurrentSchedule
  );

  useEffect(() => {
    fetchNewCurrentSchedule({ scheduleId });
  }, [scheduleId]);

  if (currentSchedule === undefined) {
    // TOOD loading state?
    return null;
  }

  return (
    <>
      <DisplaySchedule schedule={currentSchedule} />
    </>
  );
}

export default ScheduleView;
