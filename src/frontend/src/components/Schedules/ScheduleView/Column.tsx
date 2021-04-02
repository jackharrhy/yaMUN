import React from "react";

export interface IColumn {
  _id: string;
  beginTime: number;
  endTime: number;
  name: string;
  subject: string;
  number: string;
}

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
            key={index}
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
      {courses.map(({ _id, name, subject, number, beginTime, endTime }) => {
        const beginHour = Math.floor((beginTime - minTime) / 100);
        const beginHalf = (beginTime - beginHour * 100 - minTime) / 30;
        const distHour = Math.floor((endTime - beginTime) / 100);
        const distHalf = (endTime - beginTime - distHour * 100) / 30;

        return (
          <div
            key={`${beginTime}-${endTime}-${_id}`}
            className="flex-1 w-full text-center text-white text-xs absolute bg-red-600 rounded-sm border border-red-800 "
            style={{
              height: `${distHour * 2 + distHalf}rem`,
              top: `${beginHour * 2 + beginHalf}rem`,
            }}
          >
            <p>
              {subject} {number}
            </p>
            <p>{name}</p>
          </div>
        );
      })}
    </div>
  </div>
);

export default Column;
