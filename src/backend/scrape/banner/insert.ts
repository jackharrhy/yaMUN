import debugFactory from "debug";
import { coursesFromSemester } from ".";

import { database } from "../../database";
import Course, { ICourse } from "../../models/course";
import { ISemester } from "../../models/semester";

const debug = debugFactory("backend/scrape/banner/insert-data");

export async function insertSemester(semester: ISemester) {
  const testCourses = await coursesFromSemester(semester);
  await insertData(testCourses);
}

export default async function insertData(courses: ICourse[]) {
  debug("starting!");
  const session = await database.startSession();
  session.startTransaction();

  await Course.create(courses);

  await session.commitTransaction();
  session.endSession();
  debug("done!");
}
