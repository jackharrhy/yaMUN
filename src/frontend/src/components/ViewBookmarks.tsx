import React from "react";
import useBookmarks from "../hooks/useBookmarks";

function ViewBookmarks() {
  const { bookmarks, error } = useBookmarks();

  if (bookmarks === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <pre><code>{JSON.stringify(bookmarks)}</code></pre>
    </>
  );
}

export default ViewBookmarks;
