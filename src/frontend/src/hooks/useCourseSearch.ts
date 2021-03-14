import { useEffect, useMemo, useState } from "react";
import { useQueryParams, StringParam, NumberParam } from "use-query-params";

import { ICourseDocument } from "../../../backend/models/course";

export type Filters = {
  page?: number;
  semesterYear?: number;
  semesterTerm?: number;
  semesterLevel?: number;
  subject?: string;
  number?: string;
};

const API_BASE = "/api";

export default function useCourseSearch(filters: Filters) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [query, setQuery] = useQueryParams({
    page: NumberParam,
    semesterYear: NumberParam,
    semesterTerm: NumberParam,
    semesterLevel: NumberParam,
    subject: StringParam,
    number: StringParam,
  });

  const { page: pageFromQuery } = query;

  const page = pageFromQuery ?? 0;

  useEffect(() => {
    setQuery(
      {
        page: filters.page,
        semesterYear: filters.semesterYear,
        semesterTerm: filters.semesterTerm,
        semesterLevel: filters.semesterLevel,
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
      page: page.toString(),
    });
  }, [query]);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE}/courses/?${params}`).then(async (res) => {
      if (!isMounted) return;
      const json = await res.json();

      if (res.ok) {
        setError(null);
        setData(json);
      } else {
        setData([]);
        setError(json.error);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [params]);

  return {
    courses: data as ICourseDocument[],
    error,
    page: page ?? 0,
    nextPage: () => {
      setQuery({ page: page + 1 });
    },
    previousPage: () => {
      if (page > 0) {
        const newPage = page === 1 ? undefined : page - 1;
        setQuery({ page: newPage });
      }
    },
  };
}
