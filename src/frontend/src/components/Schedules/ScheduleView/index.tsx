import React, { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { ICourseDocument } from "../../../../../backend/models/course";
import { useStoreActions, useStoreState } from "../../../store";
import DisplayCourses from "../../Course/DisplayCourses";
import DisplaySchedule from "./DisplaySchedule";

interface IFullScheduleViewParams {
  scheduleId: string;
}

function ScheduleView() {
  const { scheduleId } = useParams<IFullScheduleViewParams>();

  const currentSchedule = useStoreState((state) => state.currentSchedule);
  const setCurrentSchedule = useStoreActions(
    (actions) => actions.setCurrentSchedule
  );
  const fetchNewCurrentSchedule = useStoreActions(
    (actions) => actions.fetchNewCurrentSchedule
  );

  useEffect(() => {
    fetchNewCurrentSchedule({ scheduleId });
  }, [scheduleId]);

  const courses = useMemo(() => {
    if (currentSchedule?.resolvedCourses === undefined) {
      return undefined;
    }

    const addedCourses = currentSchedule.resolvedCourses.flat();

    const uniqueAddedCourses = Array.from(
      new Set(addedCourses.map((c) => c._id))
    ).map((id) => addedCourses.find((c) => c._id === id) as ICourseDocument);

    return uniqueAddedCourses;
  }, [currentSchedule]);

  if (currentSchedule === undefined || currentSchedule._id !== scheduleId) {
    // TOOD loading state?
    return null;
  }

  return (
    <>
      <Link
        to="/schedules"
        onClick={() => {
          setCurrentSchedule(undefined);
        }}
      >
        <p className="text-sm text-center mt-1 mb-3">Back to Schedules</p>
      </Link>
      <DisplaySchedule courses={courses} />
      <DisplayCourses courses={courses} />
    </>
  );
}

export default ScheduleView;
