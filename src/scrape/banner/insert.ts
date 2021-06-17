import debugFactory from "debug";

import { ICourse, ISemester } from "../../types";
import { coursesFromSemester } from "./banner";

const debug = debugFactory("backend/scrape/banner/insert-data");

export async function insertSemester(semester: ISemester) {
  const courses = await coursesFromSemester(semester);
  if (courses === null) {
    throw new Error("attempted to insert a semester without any valid courses");
  }
  await insertCourses(courses);
}

export default async function insertCourses(courses: ICourse[]) {
  debug("starting to insert courses!");

  // TODO insert courses
  // await Course.create(courses);

  debug("done inserting courses!");
}
