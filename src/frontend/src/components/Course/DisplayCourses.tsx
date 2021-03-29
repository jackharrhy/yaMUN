import React from "react";

import { ICourseDocument } from "../../../../backend/models/course";
import Course from "../Course";

function DisplayCourses({ courses }: { courses?: ICourseDocument[] }) {
  if (courses === undefined) {
    // TODO loading state
    return null;
  }

  return (
    <>
      {courses.map((course) => (
        <Course key={course._id} course={course} />
      ))}
    </>
  );
}

export default DisplayCourses;
