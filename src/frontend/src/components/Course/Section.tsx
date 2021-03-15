import React from "react";
import { MdStarBorder } from "react-icons/md";

import { ISectionDocument } from "../../../../backend/models/section";
import { useStoreActions } from "../../store";
import Slot from "./Slot";

function Section({ section }: { section: ISectionDocument }) {
  const addBookmark = useStoreActions((actions) => actions.addBookmark);

  const instructor = section.primaryInstructor
    ? ` - ${section.primaryInstructor}`
    : "";

  return (
    <div className="pt-1 pb-1.5 px-2 border-2 rounded shadow-sm">
      <div className="flex items-start justify-between">
        <p>
          <code>{section.crn}</code>
          {instructor}
        </p>
        <button
          style={{ marginRight: "-0.25rem" }}
          type="submit"
          onClick={() => addBookmark(section.crn)}
        >
          <MdStarBorder aria-hidden="true" title="Add to Bookmarks" />
          <span className="visually-hidden">Add to Bookmarks</span>
        </button>
      </div>
      {section.slots.map((slot) => (
        <Slot key={slot._id} slot={slot} />
      ))}
    </div>
  );
}

export default Section;
