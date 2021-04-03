import React from "react";

import { formatTime } from "../../Course/Slot";

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

export default HourCell;
