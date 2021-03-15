import React from "react";
import { useQueryParams, StringParam, NumberParam } from "use-query-params";

import { ICourseDocument } from "../../../../backend/models/course";
import useCourseQueryParams from "../../hooks/useUpdateCourseQueryParams";
import { useStoreActions, useStoreState } from "../../store";
import Course from "../Course";
import Pagination from "../Pagination";
import SetFilters from "./SetFilters";

function DisplayCourses({ courses }: { courses?: ICourseDocument[] }) {
  if (courses === undefined) {
    // TODO loading state
    return null;
  }

  return (
    <>
      {courses.map((course) => (
        <Course key={course._id} course={course} />
      ))}
    </>
  );
}

function FindCourses() {
  /*
  const [query] = useQueryParams({
    page: NumberParam,
    semesterYear: NumberParam,
    semesterTerm: NumberParam,
    semesterLevel: NumberParam,
    subject: StringParam,
    number: StringParam,
  });

  const [filters, setFilters] = useState<Filters>({
    page: query.page ?? undefined,
    semesterYear: query.semesterYear ?? undefined,
    semesterTerm: query.semesterTerm ?? undefined,
    semesterLevel: query.semesterLevel ?? undefined,
    subject: query.subject ?? undefined,
    number: query.number ?? undefined,
  });

  const { courses, error, page, nextPage, previousPage } = useCourseSearch(
    filters
  );
  */

  const courses = useStoreState((state) => state.courses);
  const filters = useStoreState((state) => state.courseFilters);
  const setCourseFilters = useStoreActions(
    (actions) => actions.setCourseFilters
  );

  const nextPage = () => {
    setCourseFilters({
      ...filters,
      page: filters.page + 1,
    });
  };

  const previousPage = () => {
    if (filters.page > 0) {
      setCourseFilters({
        ...filters,
        page: filters.page - 1,
      });
    }
  };

  const { defaults } = useCourseQueryParams(filters);

  return (
    <>
      <SetFilters defaults={defaults} />
      <Pagination
        page={filters.page}
        results={courses?.length}
        nextPage={nextPage}
        previousPage={previousPage}
      />
      <DisplayCourses courses={courses} />
      <Pagination
        page={filters.page}
        results={courses?.length}
        nextPage={nextPage}
        previousPage={previousPage}
      />
    </>
  );
}

export default FindCourses;
