import classNames from "classnames";
import React from "react";

import { ISlotDocument } from "../../../../backend/models/slot";

const dayToColor = {
  M: `#3B82F6`, // blue-500
  T: `#F59E0B`, // yellow-500
  W: `#EC4899`, // pink-500
  R: `#10B981`, // green-500
  F: `#6366F1`, // indigo-500
  S: `#6B7280`, // gray-500
  U: `#6B7280`, // gray-500
};

type Day = keyof typeof dayToColor;

function generateModifiedTime(time: number): string {
  let modifiedTime: string | number = time;
  if (time >= 1300) {
    modifiedTime -= 1200;
  } else if (time < 100) {
    modifiedTime += 1200;
  }
  return modifiedTime.toString();
}

export function formatTime(time: number): string {
  const postfix = time >= 1200 ? "pm" : "am";
  const modifiedTime = generateModifiedTime(time);
  return `${modifiedTime.slice(0, -2)}:${modifiedTime.slice(-2)}${postfix}`;
}

function Slot({ slot }: { slot: ISlotDocument }) {
  const allDays = Object.keys(dayToColor);

  const time = "rounded-full text-xs px-2 inline-block";

  if (slot.beginTime === null || slot.endTime === null) {
    return null;
  }

  return (
    <div key={slot._id}>
      {allDays.map((day) => (
        <div
          key={day}
          style={{ backgroundColor: dayToColor[day as Day] ?? "black" }}
          className={classNames(
            "rounded-full w-8 text-xs px-2 my-0.5 mr-0.5 text-center text-white border-2 inline-block",
            {
              "opacity-10 select-none": !slot.days.includes(day),
            }
          )}
        >
          {day}
        </div>
      ))}
      <div className="rounded-full text-xs px-2 inline-block">
        {`${formatTime(slot.beginTime)} → ${formatTime(slot.endTime)}`}
      </div>
    </div>
  );
}

export default Slot;
