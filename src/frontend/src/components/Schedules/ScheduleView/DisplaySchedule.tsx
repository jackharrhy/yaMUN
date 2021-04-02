import React, { useMemo } from "react";

import { ICourseDocument } from "../../../../../backend/models/course";
import Column, { IColumn } from "./Column";
import HourCell from "./HourCell";

const MIN_TIME = 0;
const MAX_TIME = 2400;

const days = [
  ["M", "Monday"],
  ["T", "Tuesday"],
  ["W", "Wednesday"],
  ["R", "Thursday"],
  ["F", "Friday"],
  ["S", "Saturday"],
  ["U", "Sunday"],
];

/*
const getConflicts = (courses: ICourse[]) => {
  const slots = courses.reduce(
    (acc, course: ICourse) =>
      [
        ...acc,
        [
          course,
          course.sections.reduce(
            (acc, section) => [...acc, ...section.slots],
            [] as ISlot[]
          ),
        ],
      ] as [ICourse, ISlot[]],
    [] as [ICourse, ISlot[]]
  );
  const conflictingSlots = slots.filter(
    (item1) =>
      !slots.find(
        (item2) =>
          item1.endTime !== null &&
          item1.beginTime !== null &&
          item2.endTime !== null &&
          item2.beginTime !== null &&
          (item1.endTime < item2.beginTime ||
            item2.endTime < item1.beginTime) &&
          item1.days.find((day) => item2.days.includes(day))
      )
  );
  return conflictingSlots;
};
*/

function DisplaySchedule({ courses, sids }: { courses?: ICourseDocument[], sids: string[] }) {
  if (courses === undefined) {
    // TODO loading state?
    return null;
  }

  if (courses.length === 0) {
    // TODO empty state?
    return <p className="text-center">No courses to display</p>;
  }

  const [columns, maxTime, minTime] = useMemo(() => {
    const columnsMap = Object.fromEntries(
      days.map(([symbol, title]) => [
        symbol,
        {
          title,
          courses: [] as IColumn[],
        },
      ])
    );
    let lastMaxTime = MIN_TIME;
    let lastMinTime = MAX_TIME;
    courses.forEach(({ _id, sections, name, number, subject }) => {
      sections.forEach(({ sid, slots }) => {
        if (!sids.includes(sid)) {
          return;
        }

        slots.forEach(({ days, beginTime, endTime }) => {
          if (beginTime === null || endTime === null) {
            // TODO ensure these skipped slots are displayed elsewhere
            return;
          }

          if (lastMaxTime < beginTime) lastMaxTime = beginTime;
          if (lastMinTime > endTime) lastMinTime = endTime;
          if (lastMinTime > beginTime) lastMinTime = beginTime;
          if (lastMaxTime < endTime) lastMaxTime = endTime;

          days.forEach((day) => {
            columnsMap[day].courses.push({
              _id,
              number,
              subject,
              beginTime,
              endTime,
              name,
            });
          });
        });
      });
    });

    return [
      Object.entries(columnsMap).map(([, value]) => value),
      Math.min((Math.floor(lastMaxTime / 100) + 1) * 100, 2300),
      Math.max((Math.floor(lastMinTime / 100) - 1) * 100, 0),
    ];
  }, [courses, sids]);

  const hours = Math.floor(maxTime / 100) - Math.floor(minTime / 100) + 1;
  const hoursMap = Array.apply(null, new Array(hours)).map((_, i) => i);
  const hoursAndHalfsMap = Array.apply(null, new Array(hours * 2)).map(
    (_, i) => i
  );

  return (
    <div className="flex mb-8" style={{ height: `${hours * 2 + 2}rem` }}>
      <div className="flex border flex-1 shadow-md rounded">
        <div className="flex-1 flex-col flex">
          <div className="flex bg-gray-100 py-1 border-b text-sm justify-center">
            Time
          </div>
          <div className="flex-1 flex flex-col relative">
            <div className="flex-1  bg-gray-100 w-full h-full absolute">
              {hoursMap.map((index) => (
                <HourCell
                  key={index}
                  minTime={minTime}
                  hours={hours}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
        {columns.map(({ title, courses }) => (
          <Column
            key={title}
            minTime={minTime}
            title={title}
            courses={courses}
            hoursAndHalfsMap={hoursAndHalfsMap}
            hours={hours}
          />
        ))}
      </div>
    </div>
  );
}

export default DisplaySchedule;
