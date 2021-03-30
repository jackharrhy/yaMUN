import React from "react";

import useCourseQueryParams from "../../hooks/usePersistCourseFilters";
import { useStoreActions, useStoreState } from "../../store";
import DisplayCourses from "../Course/DisplayCourses";
import Pagination from "../Pagination";
import SetFilters from "./SetFilters";

function FindCourses() {
  const courses = useStoreState((state) => state.courses);
  const filters = useStoreState((state) => state.courseFilters);
  const setCourseFilters = useStoreActions(
    (actions) => actions.setCourseFilters
  );

  const { defaults } = useCourseQueryParams(filters);

  const page = filters?.page;

  if (filters === undefined || defaults === undefined || page === undefined) {
    // TODO loading state?
    return null;
  }

  const nextPage = () => {
    setCourseFilters({
      ...filters,
      page: page + 1,
    });
  };

  const previousPage = () => {
    if (page > 0) {
      setCourseFilters({
        ...filters,
        page: page - 1,
      });
    }
  };

  return (
    <>
      <SetFilters defaults={defaults} />
      <Pagination
        page={page}
        results={courses?.length}
        nextPage={nextPage}
        previousPage={previousPage}
      />
      <DisplayCourses courses={courses} />
      <Pagination
        page={page}
        results={courses?.length}
        nextPage={nextPage}
        previousPage={previousPage}
        isFooter
      />
    </>
  );
}

export default FindCourses;
