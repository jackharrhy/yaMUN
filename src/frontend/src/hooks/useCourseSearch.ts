import { useEffect, useMemo, useState } from "react";
import {
  useQueryParams,
  StringParam,
  NumberParam,
  withDefault,
} from "use-query-params";

import { ICourseDocument } from "../../../backend/models/course";

export type Filters = {
  page: number;
  subject?: string;
  number?: string;
};

const API_BASE = "/api";

export default function useCourseSearch(filters: Filters) {
  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 0),
    subject: StringParam,
    number: StringParam,
  });

  const { page } = query;

  const [data, setData] = useState([]);

  useEffect(() => {
    setQuery(
      {
        page: filters.page,
        subject: filters.subject,
        number: filters.number,
      },
      "push"
    );
  }, [filters]);

  const params = useMemo(() => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined)
    );

    return new URLSearchParams({
      ...cleanedFilters,
      page: query.page.toString(),
    });
  }, [query]);

  useEffect(() => {
    fetch(`${API_BASE}/courses/?${params}`).then(async (res) => {
      const json = await res.json();
      setData(json);
    });
  }, [params]);

  return {
    courses: data as ICourseDocument[],
    page: page ?? 0,
    nextPage: () => {
      setQuery({ page: query.page + 1 });
    },
    previousPage: () => {
      if (page > 0) {
        setQuery({ page: query.page - 1 });
      }
    },
  };
}
