import React from "react";

import { ISectionDocument } from "../../../../backend/models/section";
import Slot from "./Slot";

function Section({ section }: { section: ISectionDocument }) {
  const instructor = section.primaryInstructor
    ? ` - ${section.primaryInstructor}`
    : "";

  return (
    <div className="pt-1 pb-1.5 px-2 border-2 rounded shadow-sm">
      <p>
        <code>{section.crn}</code>
        {instructor}
      </p>
      {section.slots.map((slot) => (
        <Slot key={slot._id} slot={slot} />
      ))}
    </div>
  );
}

export default Section;
