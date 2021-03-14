import classNames from "classnames";
import React from "react";

import { ISlotDocument } from "../../../../backend/models/slot";

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

export default Slot;
