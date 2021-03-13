import classNames from "classnames";
import React from "react";

import { ICourseDocument } from "../../../../backend/models/course";
import { ISectionDocument } from "../../../../backend/models/section";
import { ISlotDocument } from "../../../../backend/models/slot";

function Pill({ text }: { text: string }) {
  return (
    <div className="rounded-full text-sm font-medium bg-red-500 px-2 text-white border-2 border-red-200 inline-block">
      {text}
    </div>
  );
}

const colorNumber = 500;

const dayToColor = {
  M: `blue-${colorNumber}`,
  T: `yellow-${colorNumber}`,
  W: `pink-${colorNumber}`,
  R: `green-${colorNumber}`,
  F: `indigo-${colorNumber}`,
  S: `gray-${colorNumber}`,
  U: `gray-${colorNumber}`,
};

type Day = keyof typeof dayToColor;

function formatTime(time: number): string {
  const postfix = time >= 1200 ? "pm" : "am";

  const modifiedTime = `${time >= 1300 ? time - 1200 : time}`;

  return `${modifiedTime.slice(0, -2)}:${modifiedTime.slice(-2)}${postfix}`;
}

function Slot({ slot }: { slot: ISlotDocument }) {
  const allDays = Object.keys(dayToColor);
  const dayPill =
    "rounded-full w-8 text-xs px-2 my-0.5 mr-0.5 text-center text-white border-2 inline-block";

  const time = "rounded-full text-xs px-2 inline-block";

  if (slot.beginTime === null || slot.endTime === null) {
    return null;
  }

  return (
    <div key={slot._id}>
      {allDays.map((day) => (
        <div
          key={day}
          className={classNames(
            dayPill,
            `bg-${dayToColor[day as Day] ?? "black"}`,
            {
              "opacity-10 select-none": !slot.days.includes(day),
            }
          )}
        >
          {day}
        </div>
      ))}
      <div className={time}>
        {`${formatTime(slot.beginTime)} → ${formatTime(slot.endTime)}`}
      </div>
    </div>
  );
}

function Section({ section }: { section: ISectionDocument }) {
  const instructor = section.primaryInstructor
    ? ` - ${section.primaryInstructor}`
    : "";

  return (
    <div className="pt-1 pb-1.5 px-2 border-2 rounded shadow-sm">
      <p>
        <code>{section.crn}</code>
        {instructor}
      </p>
      {section.slots.map((slot) => (
        <Slot key={slot._id} slot={slot} />
      ))}
    </div>
  );
}

function Course({ course }: { course: ICourseDocument }) {
  const name = course.info?.title ?? course.name;

  return (
    <div className="shadow-md p-5 mb-4 rounded border">
      <p className="text-xl font-medium mb-2">
        {course.subject} {course.number} - {name}
      </p>
      <Pill text={course.campus} />
      <div className="sections mt-4 mb-2">
        {course.sections.map((section) => (
          <Section key={section._id} section={section} />
        ))}
      </div>
    </div>
  );
}

export default Course;
