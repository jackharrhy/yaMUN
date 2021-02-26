import debugFactory from "debug";

import { database } from "../../database";
import Course, { ICourse } from "../../models/course";

const debug = debugFactory("backend/scrape/banner/insert-data");

export default async function insertData(courses: ICourse[]) {
  debug("starting!");
  const session = await database.startSession();
  session.startTransaction();

  await Course.create(courses);

  await session.commitTransaction();
  session.endSession();
  debug("done!");
}
