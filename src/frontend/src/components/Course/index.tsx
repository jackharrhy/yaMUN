import React from "react";

import { ICourseDocument } from "../../../../backend/models/course";

interface CourseProps {
  course: ICourseDocument;
}

function Pill({ text }: { text: string }) {
  return (
    <div className="rounded-full text-sm bg-red-500 px-2 text-white border-2 inline-block">
      {text}
    </div>
  );
}

function Course({ course }: CourseProps) {
  return (
    <div className="shadow-md p-5 mb-4 rounded border">
      <p className="text-lg font-medium">
        <Pill text={course.campus} />
        <br />
        {course.subject} {course.number} - {course.name}
      </p>
      {course.sections.map((section) => (
        <div key={section._id} className="ml-2 mt-4">
          <p>
            {section.crn} - {section.primaryInstructor}
          </p>
          {section.slots.map((slot) => (
            <p key={slot._id}>
              {slot.days} - {slot.beginTime} to {slot.endTime}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Course;
