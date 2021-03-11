import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { COURSE_SEARCH_PAGINATION_LIMIT } from "../../../../backend/api/controllers/courses";
import { ICourseDocument } from "../../../../backend/models/course";
import useCourseSearch, { Filters } from "../../hooks/useCourseSearch";
import Course from "../Course";

interface SetFiltersProps {
  setFilters: (data: Filters) => void;
}

function SetFilters({ setFilters }: SetFiltersProps) {
  const { register, handleSubmit } = useForm<Filters>();

  const onSubmit = (data: Filters) => setFilters(data);

  return (
    <form
      className="shadow-md p-5 mb-4 rounded border"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        className="w-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-red-200"
        name="subject"
        placeholder="Subject"
        defaultValue=""
        ref={register}
      />
      <input
        className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
        name="number"
        placeholder="Course Number"
        defaultValue=""
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

type PaginationProps = {
  page: number;
  results: number;
  nextPage: () => void;
  previousPage: () => void;
};

function Pagination({
  page,
  results,
  nextPage,
  previousPage,
}: PaginationProps) {
  const userPage = page + 1;

  const canGoBack = page <= 0;
  const canGoNext = results !== COURSE_SEARCH_PAGINATION_LIMIT;

  return (
    <div className="flex place-content-between my-4">
      <button
        className={
          "border px-2 py-1 rounded-md w-32 disabled:opacity-50 disabled:cursor-not-allowed"
        }
        disabled={canGoBack}
        onClick={() => previousPage()}
      >
        Previous
      </button>
      <p className="text-lg text-center font-medium mt-1">Page {userPage}</p>
      <button
        className={
          "border px-2 py-1 rounded-md w-32 disabled:opacity-50 disabled:cursor-not-allowed"
        }
        disabled={canGoNext}
        onClick={() => nextPage()}
      >
        Next
      </button>
    </div>
  );
}

function FindCourses() {
  const [filters, setFilters] = useState<Filters>({});

  const { courses, page, nextPage, previousPage } = useCourseSearch(filters);

  if (courses === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <SetFilters setFilters={setFilters} />
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
