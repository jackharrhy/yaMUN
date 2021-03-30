import { useEffect, useState } from "react";
import { useQueryParams, StringParam, NumberParam } from "use-query-params";

import { useStoreActions } from "../store";
import { ICourseFilters } from "../store/courses";

const LOCAL_STORAGE_COURSE_FILTERS_KEY = "yamun.courseFilters";

export default function usePersistCourseFilters(filters?: ICourseFilters) {
  const setCourseFilters = useStoreActions(
    (actions) => actions.setCourseFilters
  );
  const [defaults, setDefaults] = useState<ICourseFilters | undefined>();

  const [query, setQuery] = useQueryParams({
    page: NumberParam,
    semesterYear: NumberParam,
    semesterTerm: NumberParam,
    semesterLevel: NumberParam,
    subject: StringParam,
    number: StringParam,
  });

  useEffect(() => {
    const defaultsFromQuery: ICourseFilters = {
      page: query.page ?? undefined,
      semesterYear: query.semesterYear ?? undefined,
      semesterTerm: query.semesterTerm ?? undefined,
      semesterLevel: query.semesterLevel ?? undefined,
      subject: query.subject ?? undefined,
      number: query.number ?? undefined,
    };

    const set = new Set(Object.values(defaultsFromQuery));

    if (set.size === 1 && set.has(undefined)) {
      const localStorageCourseFilters = localStorage.getItem(
        LOCAL_STORAGE_COURSE_FILTERS_KEY
      );

      if (localStorageCourseFilters !== null) {
        setDefaults({
          ...defaultsFromQuery,
          ...(JSON.parse(localStorageCourseFilters) as ICourseFilters),
        });
        return;
      }
    }

    setDefaults({
      ...defaultsFromQuery,
      page: defaultsFromQuery.page ?? 0,
    });
  }, []);

  useEffect(() => {
    if (defaults !== undefined) {
      setCourseFilters({
        ...defaults,
        page: defaults?.page ?? 0,
      });
    }
  }, [defaults]);

  useEffect(() => {
    if (filters !== undefined && defaults !== undefined) {
      localStorage.setItem(
        LOCAL_STORAGE_COURSE_FILTERS_KEY,
        JSON.stringify(filters)
      );

      setQuery(
        {
          page: filters.page === 0 ? undefined : filters.page,
          semesterYear: filters.semesterYear,
          semesterTerm: filters.semesterTerm,
          semesterLevel: filters.semesterLevel,
          subject: filters.subject,
          number: filters.number,
        },
        "push"
      );
    }
  }, [filters]);

  return { defaults };
}
