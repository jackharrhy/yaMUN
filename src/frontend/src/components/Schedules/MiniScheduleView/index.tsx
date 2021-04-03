import React from "react";
import { BiTrash } from "react-icons/bi";
import { HiExternalLink } from "react-icons/hi";
import { useHistory } from "react-router";

import { IScheduleDocument } from "../../../../../backend/models/schedule";
import { useStoreActions } from "../../../store";
import Box from "../../Box";

function MiniScheduleView({ schedule }: { schedule: IScheduleDocument }) {
  const history = useHistory();

  const removeSchedule = useStoreActions((actions) => actions.removeSchedule);

  return (
    <Box style={{ width: "32rem" }} className="p-5 mb-4 mx-auto">
      <div className="flex items-start justify-between">
        <p className="text-xl font-medium mb-2">{schedule.title}</p>
        <div>
          <button
            className="relative top-0 right-0"
            type="submit"
            onClick={() => {
              history.push(`/schedules/${schedule._id}`);
            }}
          >
            <HiExternalLink
              aria-hidden="true"
              title="Set as Current Schedule"
            />
            <span className="visually-hidden">Set as Current Schedule</span>
          </button>
          <button
            className="relative top-0 right-0"
            type="submit"
            onClick={() => {
              const choice = confirm(
                "Are you sure you want to delete this schedule?"
              );

              if (choice) {
                removeSchedule({ scheduleId: schedule._id });
              }
            }}
          >
            <BiTrash aria-hidden="true" title="Remove Schedule" />
            <span className="visually-hidden">Remove Schedule</span>
          </button>
        </div>
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
