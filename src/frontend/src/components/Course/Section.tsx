import React from "react";
import { MdStar, MdStarBorder } from "react-icons/md";

import { ISectionDocument } from "../../../../backend/models/section";
import { useStoreActions, useStoreState } from "../../store";
import Slot from "./Slot";

const bookmarkAdded = `#FBBF24`; // yellow-400

function Section({ section }: { section: ISectionDocument }) {
  const addBookmark = useStoreActions((actions) => actions.addBookmark);
  const removeBookmark = useStoreActions((actions) => actions.removeBookmark);
  const bookmarks = useStoreState((state) => state.bookmarks);
  const loggedIn = useStoreState((state) => state.loggedIn);

  const isBookmarked = bookmarks?.courses.includes(section.sid);

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
        {loggedIn && (
          <button
            style={{ marginRight: "-0.25rem" }}
            type="submit"
            onClick={() => {
              if (isBookmarked) {
                removeBookmark(section.sid);
              } else {
                addBookmark(section.sid);
              }
            }}
          >
            {isBookmarked ? (
              <>
                <MdStar
                  aria-hidden="true"
                  title="Remove from Bookmarks"
                  color={bookmarkAdded}
                />
                <span className="visually-hidden">Remove from Bookmarks</span>
              </>
            ) : (
              <>
                <MdStarBorder aria-hidden="true" title="Add to Bookmarks" />
                <span className="visually-hidden">Add to Bookmarks</span>
              </>
            )}
          </button>
        )}
      </div>
      {section.slots.map((slot) => (
        <Slot key={slot._id} slot={slot} />
      ))}
    </div>
  );
}

export default Section;
