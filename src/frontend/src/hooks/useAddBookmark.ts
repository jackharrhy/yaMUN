import { toast } from "react-hot-toast";

import { API_BASE } from "../api";

export type Filters = {
  page?: number;
  semesterYear?: number;
  semesterTerm?: number;
  semesterLevel?: number;
  subject?: string;
  number?: string;
};

export default function useAddBookmarks() {
  const addBookmark = (crn: number) => {
    let isMounted = true;
    fetch(`${API_BASE}/bookmarks/courses/${crn}`, { method: "PUT" }).then(
      async (res) => {
        if (!isMounted) return;

        console.log(res);

        if (res.ok) {
          toast.success(`Added CRN ${crn} to bookmarks`);
        } else {
          const json = await res.json();
          toast.error(json.error);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  };

  return { addBookmark };
}
