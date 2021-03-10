import React from "react";

import { ICourse } from "../../../../backend/models/course";

interface CourseProps {
  course: ICourse;
}

function Course({ course }: CourseProps) {
  return (
    <div className="shadow-xl p-5 mb-4 rounded border">
      <p className="text-lg font-medium">
        {course.campus} | {course.subject} {course.number} - {course.name}
      </p>
      {course.sections.map((section) => (
        <div className="ml-2 mt-4">
          <p>
            {section.crn} - {section.primaryInstructor}
          </p>
          {section.slots.map((slot) => (
            <p>
              {slot.days} - {slot.beginTime} to {slot.endTime}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Course;
