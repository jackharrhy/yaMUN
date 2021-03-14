import React, { useState } from "react";
import { useQueryParams, StringParam, NumberParam } from "use-query-params";

import { ICourseDocument } from "../../../../backend/models/course";
import useAddBookmarks from "../../hooks/useAddBookmark";
import useCourseSearch, { Filters } from "../../hooks/useCourseSearch";
import Course from "../Course";
import DisplayError from "../DisplayError";
import Pagination from "../Pagination";
import SetFilters from "./SetFilters";

interface DisplayCoursesProps {
  courses: ICourseDocument[];
  addBookmark: (crn: number) => void;
}

function DisplayCourses({ courses, addBookmark }: DisplayCoursesProps) {
  return (
    <>
      {courses.map((course) => (
        <Course key={course._id} course={course} addBookmark={addBookmark} />
      ))}
    </>
  );
}

function FindCourses() {
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

  const { addBookmark } = useAddBookmarks();

  if (courses === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <SetFilters filters={filters} setFilters={setFilters} />
      <DisplayError error={error} />
      <Pagination
        page={page}
        results={courses.length}
        nextPage={nextPage}
        previousPage={previousPage}
      />
      <DisplayCourses courses={courses} addBookmark={addBookmark} />
      <Pagination
        page={page}
        results={courses.length}
        nextPage={nextPage}
        previousPage={previousPage}
      />
    </>
  );
}

export default FindCourses;
