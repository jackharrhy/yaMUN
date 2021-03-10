import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { ICourse } from "../../../../backend/models/course";
import useCourseSearch, { Filters } from "../../hooks/useCourseSearch";
import Course from "../Course";

interface SetFiltersProps {
  setFilters: (data: Filters) => void;
}

function SetFilters({ setFilters }: SetFiltersProps) {
  const { register, handleSubmit } = useForm<Filters>();

  const onSubmit = (data: Filters) => setFilters(data);

  return (
    <div className="shadow-xl p-5 mb-4 rounded border">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input name="subject" placeholder="Subject" defaultValue="" ref={register} />
        <input name="number" placeholder="Course Number" defaultValue="" ref={register} />
        <input type="submit" />
      </form>
    </div>
  );
}

interface DisplayCoursesProps {
  courses: ICourse[];
}

function DisplayCourses({ courses }: DisplayCoursesProps) {
  return (
    <>
      {courses.map((course) => (
        <Course course={course} />
      ))}
    </>
  );
}

function FindCourses() {
  const [filters, setFilters] = useState<Filters>({});

  const { courses } = useCourseSearch(filters);

  if (courses === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <SetFilters setFilters={setFilters} />
      <DisplayCourses courses={courses} />
    </>
  );
}

export default FindCourses;
