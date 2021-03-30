import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

import { ICourse } from "../../../../backend/models/course";
import { ISlot } from "../../../../backend/models/slot";
import { formatTime } from "../Course/Slot";
import semester from "./data.json";

interface IColumn {
  beginTime: number;
  endTime: number;
  name: string;
  subject: string;
  number: string;
}

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

const HourCell = ({
  index,
  hours,
  minTime,
}: {
  index: number;
  hours: number;
  minTime: number;
}) => (
  <div
    className={`flex flex-1 relative items-center justify-center ${
      index === hours - 1 ? "" : "border-b border-blue-300"
    }`}
    style={{
      height: "2rem",
    }}
  >
    {formatTime(minTime + index * 100)}
  </div>
);

const Column = ({
  title,
  courses,
  hoursAndHalfsMap,
  minTime,
  hours,
}: {
  title: string;
  courses: IColumn[];
  hoursAndHalfsMap: number[];
  hours: number;
  minTime: number;
}) => (
  <div className="flex-1 flex-col flex border-r border-gray-100">
    <div className="flex font-bold py-1 bg-gray-100 border-b text-sm justify-center">
      {title}
    </div>
    <div className="flex-1 flex flex-col relative">
      <div className="flex-1 w-full h-full absolute">
        {hoursAndHalfsMap.map((index) => (
          <div
            className={`flex-1 relative ${
              index === hours * 2 - 1
                ? ""
                : index % 2 === 0
                ? "border-b"
                : "border-b border-blue-300"
            }`}
            style={{
              height: "1rem",
            }}
          />
        ))}
      </div>
      {courses.map(({ name, subject, number, beginTime, endTime }) => {
        const beginHour = Math.floor((beginTime - minTime) / 100);
        const beginHalf = (beginTime - beginHour * 100 - minTime) / 30;
        const distHour = Math.floor((endTime - beginTime) / 100);
        const distHalf = (endTime - beginTime - distHour * 100) / 30;

        return (
          <div
            className="flex-1 text-center text-white text-xs absolute bg-red-600 rounded"
            style={{
              height: `${distHour * 2 + distHalf}rem`,
              top: `${beginHour * 2 + beginHalf}rem`,
            }}
          >
            {subject} {number} - {name}
          </div>
        );
      })}
    </div>
  </div>
);

interface IFullScheduleViewParams {
  scheduleId: string;
}

function FullScheduleView() {
  const { scheduleId } = useParams<IFullScheduleViewParams>();

  const { resolvedCourses } = semester;

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
    resolvedCourses.forEach(({ sections, name, number, subject }) => {
      sections.forEach(({ slots }) => {
        slots.forEach(({ days, beginTime, endTime }) => {
          if (lastMaxTime < beginTime) lastMaxTime = beginTime;
          if (lastMinTime > endTime) lastMinTime = endTime;
          if (lastMinTime > beginTime) lastMinTime = beginTime;
          if (lastMaxTime < endTime) lastMaxTime = endTime;
          days.forEach((day) => {
            columnsMap[day].courses.push({
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
                <HourCell minTime={minTime} hours={hours} index={index} />
              ))}
            </div>
          </div>
        </div>
        {columns.map(({ title, courses }) => (
          <Column
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

export default FullScheduleView;
