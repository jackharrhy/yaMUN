import { useEffect } from "react";
import { useQueryParams, StringParam, NumberParam } from "use-query-params";

import { useStoreActions } from "../store";
import { ICourseFilters } from "../store/courses";

// TODO write function to pull from course filters localStorage here

export default function usePersistCourseFilters(filters: ICourseFilters) {
  const setCourseFilters = useStoreActions(
    (actions) => actions.setCourseFilters
  );

  const [query, setQuery] = useQueryParams({
    page: NumberParam,
    semesterYear: NumberParam,
    semesterTerm: NumberParam,
    semesterLevel: NumberParam,
    subject: StringParam,
    number: StringParam,
  });

  const defaults = {
    page: query.page ?? 0,
    semesterYear: query.semesterYear ?? undefined,
    semesterTerm: query.semesterTerm ?? undefined,
    semesterLevel: query.semesterLevel ?? undefined,
    subject: query.subject ?? undefined,
    number: query.number ?? undefined,
  };

  useEffect(() => {
    setCourseFilters(defaults);
  }, []);

  useEffect(() => {
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
  }, [filters]);

  return { defaults };
}
