import React from "react";

import { ICourseDocument } from "../../../../backend/models/course";
import useCourseQueryParams from "../../hooks/usePersistCourseFilters";
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
