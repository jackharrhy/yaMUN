import { useEffect, useMemo, useState } from "react";

import { ICourseDocument } from "../../../backend/models/course";

export type Filters = {
  subject?: string;
  number?: string;
};

const API_BASE = "/api";

export default function useCourseSearch(filters: Filters) {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    setPage(0);
  }, [filters]);

  const params = useMemo(() => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([k, v]) => v !== "")
    );

    return new URLSearchParams({
      ...cleanedFilters,
      page: page.toString(),
    });
  }, [filters, page]);

  useEffect(() => {
    fetch(`${API_BASE}/courses/?${params}`).then(async (res) => {
      const json = await res.json();
      setData(json);
    });
  }, [params]);

  return {
    courses: data as ICourseDocument[],
    page,
    nextPage: () => {
      setPage(page + 1);
    },
    previousPage: () => {
      if (page > 0) setPage(page - 1);
    },
  };
}
