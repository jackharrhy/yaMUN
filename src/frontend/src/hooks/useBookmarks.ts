import { useEffect, useState } from "react";

import { IBookmarkDocument } from "../../../backend/models/bookmark";
import { API_BASE } from "../api";

export type Filters = {
  page?: number;
  semesterYear?: number;
  semesterTerm?: number;
  semesterLevel?: number;
  subject?: string;
  number?: string;
};

export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<IBookmarkDocument | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE}/bookmarks/courses`).then(async (res) => {
      if (!isMounted) return;
      const json = await res.json();

      if (res.ok) {
        setError(null);
        setBookmarks(json);
      } else {
        setBookmarks(null);
        setError(json.error);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    bookmarks,
    error,
  };
}
