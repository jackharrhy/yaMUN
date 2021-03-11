import { useEffect, useState } from "react";

import { ICourse } from "../../../backend/models/course";

export type Filters = {
  subject?: string;
  number?: string;
};

const API_BASE = "/api";

export default function useCourseSearch(filters: Filters) {
  const [page, setPage] = useState(0);
  const [params, setParams] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([k, v]) => v !== "")
    );

    const searchParams = new URLSearchParams({
      ...cleanedFilters,
      page: page.toString(),
    });

    setPage(0);
    setParams(searchParams.toString());
  }, [filters]);

  useEffect(() => {
    fetch(`${API_BASE}/courses/?${params}`).then(async (res) => {
      const json = await res.json();
      setData(json);
    });
  }, [page, params]);

  return {
    courses: data as ICourse[],
    nextPage: () => setPage(page + 1),
  };
}
