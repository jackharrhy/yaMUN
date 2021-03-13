import React, { useState } from "react";
import { useQueryParams, StringParam, NumberParam } from "use-query-params";

import { ICourseDocument } from "../../../../backend/models/course";
import useCourseSearch, { Filters } from "../../hooks/useCourseSearch";
import Course from "../Course";
import Pagination from "../Pagination";
import SetFilters from "./SetFilters";

interface DisplayCoursesProps {
  courses: ICourseDocument[];
}

function DisplayCourses({ courses }: DisplayCoursesProps) {
  return (
    <>
      {courses.map((course) => (
        <Course key={course._id} course={course} />
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

  if (courses === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <SetFilters filters={filters} setFilters={setFilters} />
      {error && <p className="text-md text-red-900 font-bold">{error}</p>}
      <Pagination
        page={page}
        results={courses.length}
        nextPage={nextPage}
        previousPage={previousPage}
      />
      <DisplayCourses courses={courses} />
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
