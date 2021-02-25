import { database } from "../../database";
import Course, { ICourse } from "../../database/models/course";

export default async function insertData(courses: ICourse[]) {
  const session = await database.startSession();
  session.startTransaction();

  await Course.create(courses);

  await session.commitTransaction();
  session.endSession();
}
