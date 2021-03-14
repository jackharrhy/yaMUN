import React from "react";

import { ICourseDocument } from "../../../../backend/models/course";
import { ISemesterDocument } from "../../../../backend/models/semester";
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

  return (
    <div className="shadow-md p-5 mb-4 rounded border">
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
    </div>
  );
}

export default Course;
