import React from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdStar, MdStarBorder } from "react-icons/md";

import { ISectionDocument } from "../../../../backend/models/section";
import { useStoreActions, useStoreState } from "../../store";
import Slot from "./Slot";

const bookmarkAdded = `#FBBF24`; // yellow-400

function Section({ section }: { section: ISectionDocument }) {
  const loggedIn = useStoreState((state) => state.loggedIn);

  const addBookmark = useStoreActions((actions) => actions.addBookmark);
  const removeBookmark = useStoreActions((actions) => actions.removeBookmark);
  const bookmarks = useStoreState((state) => state.bookmarks);

  const addCourseToSchedule = useStoreActions(
    (actions) => actions.addCourseToSchedule
  );
  const currentSchedule = useStoreState((state) => state.currentSchedule);

  const isAddedToCurrentSchedule = false;

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
          <div>
            {currentSchedule !== undefined && (
              <button
                type="submit"
                onClick={() => {
                  if (isAddedToCurrentSchedule) {
                    alert("remove");
                  } else {
                    addCourseToSchedule({
                      scheduleId: currentSchedule._id,
                      sid: section.sid,
                    });
                  }
                }}
              >
                {isAddedToCurrentSchedule ? (
                  <>
                    <IoMdAddCircleOutline
                      aria-hidden="true"
                      title="Remove from Current Schedule"
                      color={bookmarkAdded}
                    />
                    <span className="visually-hidden">
                      Remove from Current Schedule
                    </span>
                  </>
                ) : (
                  <>
                    <IoMdAddCircleOutline
                      aria-hidden="true"
                      title="Add to Current Schedule"
                    />
                    <span className="visually-hidden">
                      Add to Current Schedule
                    </span>
                  </>
                )}
              </button>
            )}
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
          </div>
        )}
      </div>
      {section.slots.map((slot) => (
        <Slot key={slot._id} slot={slot} />
      ))}
    </div>
  );
}

export default Section;
