import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

import { ICourseDocument } from "../../../../../backend/models/course";
import { IScheduleDocument } from "../../../../../backend/models/schedule";
import Column, { IColumn } from "./Column";
import HourCell from "./HourCell";
import semester from "./data.json";

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

function DisplaySchedule({ courses }: { courses?: ICourseDocument[] }) {
  if (courses === undefined) {
    // TODO loading state?
    return null;
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
    let lastMaxTime = 0;
    let lastMinTime = Number.MAX_VALUE;
    courses.forEach(({ _id, sections, name, number, subject }) => {
      sections.forEach(({ slots }) => {
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
  }, []);

  const hours = Math.floor(maxTime / 100) - Math.floor(minTime / 100) + 1;
  const hoursMap = Array.apply(null, new Array(hours)).map((_, i) => i);
  const hoursAndHalfsMap = Array.apply(null, new Array(hours * 2)).map(
    (_, i) => i
  );

  return (
    <div className="flex mb-8" style={{ height: `${hours * 2 + 2}rem` }}>
      <div className="flex border flex-1">
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
