import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";

import { ICourseDocument } from "../../../../backend/models/course";
import { ISemesterDocument } from "../../../../backend/models/semester";
import Box from "../Box";
import Section from "./Section";

function Pill({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <div
      style={style}
      className="rounded-full text-sm font-medium bg-red-500 px-2 text-white border-2 border-red-200 inline-block"
    >
      {text}
    </div>
  );
}

export const termToName = ["Fall", "Winter", "Spring"];
export const levelToName = ["Undergrad", "Graduate"];

function formatSemester(semester: ISemesterDocument): string {
  return `${termToName[semester.term - 1]} ${semester.year} - ${
    levelToName[semester.level - 1]
  }`;
}

function Course({ course }: { course: ICourseDocument }) {
  const name = course.info?.title ?? course.name;
  const semester = formatSemester(course.semester);
  const [isExpanded, setIsExpanded] = useState(false);

  const canExpand = course.info?.description !== undefined;

  return (
    <Box className="px-5 pt-4 pb-2 mb-4">
      <p className="text-xl font-medium mb-2">
        {course.subject} {course.number} - {name}
      </p>
      <Pill style={{ marginRight: "0.5rem" }} text={semester} />
      <Pill text={course.campus} />
      <div className="sections mt-4 mb-2">
        {course.sections.map((section) => (
          <Section key={section._id} section={section} />
        ))}
      </div>
      {canExpand && (
        <button
          style={{ marginLeft: "-0.25rem" }}
          type="submit"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? (
            <>
              <FiInfo aria-hidden="true" title="Close More Info" />
              <span className="visually-hidden">Close More Info</span>
            </>
          ) : (
            <>
              <FiInfo aria-hidden="true" title="Open More Info" />
              <span className="visually-hidden">Open More Info</span>
            </>
          )}
        </button>
      )}
      {isExpanded && (
        <>
          <p>
            <span className="font-bold">{course.info?.title}</span>{" "}
            {course.info?.description}
          </p>
          <p className="mt-2 text-sm">{course.info?.attributes}</p>
        </>
      )}
    </Box>
  );
}

export default Course;
