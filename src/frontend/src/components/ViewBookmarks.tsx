import React, { useEffect } from "react";

import { useStoreActions, useStoreState } from "../store";

function ViewBookmarks() {
  const bookmarks = useStoreState((state) => state.bookmarks);
  const fetchBookmarks = useStoreActions((actions) => actions.fetchBookmarks);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (bookmarks === undefined) {
    // TODO loading state?
    return null;
  }

  return (
    <pre>
      <code>{JSON.stringify(bookmarks, null, 2)}</code>
    </pre>
  );
}

export default ViewBookmarks;
