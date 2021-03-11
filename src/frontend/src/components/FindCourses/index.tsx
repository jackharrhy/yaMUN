import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryParams, StringParam, NumberParam } from "use-query-params";

import { ICourseDocument } from "../../../../backend/models/course";
import useCourseSearch, { Filters } from "../../hooks/useCourseSearch";
import Course from "../Course";
import Pagination from "../Pagination";

interface SetFiltersProps {
  filters: Filters;
  setFilters: (data: Filters) => void;
}

function SetFilters({ filters, setFilters }: SetFiltersProps) {
  const { register, handleSubmit } = useForm<Filters>();

  const onSubmit = (data: Filters) => {
    setFilters({
      page: 0,
      subject: data.subject === "" ? undefined : data.subject,
      number: data.number === "" ? undefined : data.number,
    });
  };

  return (
    <form
      className="shadow-md p-5 mb-4 rounded border"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        className="w-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-red-200"
        name="subject"
        placeholder="Subject"
        defaultValue={filters.subject ?? ""}
        ref={register}
      />
      <input
        className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
        name="number"
        placeholder="Course Number"
        defaultValue={filters.number ?? ""}
        ref={register}
      />
      <input
        className="w-full py-0.5 mt-4 border bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
        type="submit"
      />
    </form>
  );
}

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
    subject: StringParam,
    number: StringParam,
  });

  const [filters, setFilters] = useState<Filters>({
    page: query.page ?? 0,
    subject: query.subject ?? undefined,
    number: query.number ?? undefined,
  });

  const { courses, page, nextPage, previousPage } = useCourseSearch(filters);

  if (courses === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <SetFilters filters={filters} setFilters={setFilters} />
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
