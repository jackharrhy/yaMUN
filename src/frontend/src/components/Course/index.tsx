import React from "react";

import { ICourseDocument } from "../../../../backend/models/course";
import { ISection } from "../../../../backend/models/section";
import { ISlot } from "../../../../backend/models/slot";

function Pill({ text }: { text: string }) {
  return (
    <div className="rounded-full text-sm font-medium bg-red-500 px-2 text-white border-2 border-red-200 inline-block">
      {text}
    </div>
  );
}

function Slot({ slot }: { slot: ISlot }) {
  const hasTime = slot.beginTime !== null || slot.endTime !== null;

  if (!hasTime) {
    return null;
  }

  return (
    <p key={slot._id}>
      {slot.days} - {slot.beginTime} to {slot.endTime}
    </p>
  );
}

function Section({ section }: { section: ISection }) {
  return (
    <div className="mt-4 py-1 px-2 border-2 rounded shadow-sm">
      <p>
        <code>{section.crn}</code> - {section.primaryInstructor}
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
        {course.subject} {course.number}
      </p>
      <Pill text={course.campus} />
      {course.sections.map((section) => (
        <Section key={section._id} section={section} />
      ))}
    </div>
  );
}

export default Course;
