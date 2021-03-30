import React, { useEffect, useMemo } from "react";

import { ICourseDocument } from "../../../backend/models/course";
import { useStoreActions, useStoreState } from "../store";
import DisplayCourses from "./Course/DisplayCourses";

function ViewBookmarks() {
  const bookmarks = useStoreState((state) => state.bookmarks);
  const fetchBookmarks = useStoreActions((actions) => actions.fetchBookmarks);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const bookmarkedCourses = useMemo(() => {
    if (bookmarks?.resolvedCourses === undefined) {
      return undefined;
    }

    const bookmarkedCourses = bookmarks.resolvedCourses.flat();

    const uniqueBookmarkedCourses = Array.from(
      new Set(bookmarkedCourses.map((c) => c._id))
    ).map(
      (id) => bookmarkedCourses.find((c) => c._id === id) as ICourseDocument
    );

    return uniqueBookmarkedCourses;
  }, [bookmarks]);

  if (bookmarkedCourses?.length === 0) {
    return <p className="text-center">No bookmarks.</p>;
  }

  return <DisplayCourses courses={bookmarkedCourses} />;
}

export default ViewBookmarks;
