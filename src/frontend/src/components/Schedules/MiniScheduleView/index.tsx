import React from "react";
import { HiExternalLink } from "react-icons/hi";
import { useHistory } from "react-router";

import { IScheduleDocument } from "../../../../../backend/models/schedule";
import Box from "../../Box";

function MiniScheduleView({ schedule }: { schedule: IScheduleDocument }) {
  const history = useHistory();

  return (
    <Box style={{ width: "32rem" }} className="p-5 mb-4 mx-auto">
      <div className="flex items-start justify-between">
        <p className="text-xl font-medium mb-2">{schedule.title}</p>
        <button
          className="relative top-0 right-0"
          type="submit"
          onClick={() => {
            history.push(`/schedules/${schedule._id}`);
          }}
        >
          <HiExternalLink aria-hidden="true" title="Set Current Schedule" />
          <span className="visually-hidden">Set Current Schedule</span>
        </button>
      </div>
      <p className="text-md mb-2">{schedule.description}</p>
      <p className="text-sm font-light">{schedule.courses.length} courses</p>
    </Box>
  );
}

function MiniScheduleViews({ schedules }: { schedules?: IScheduleDocument[] }) {
  if (schedules === undefined) {
    // TODO loading state?
    return null;
  }

  return (
    <>
      {schedules.map((schedule) => (
        <MiniScheduleView key={schedule._id} schedule={schedule} />
      ))}
    </>
  );
}

export default MiniScheduleViews;
