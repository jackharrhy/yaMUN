import debugFactory from "debug";
import * as db from "zapatos/db";

import pool from "../../db/pool";
import { ICourse } from "../../types";

const debug = debugFactory("scrape/banner/insert-data");

export default async function insertCourses(courses: ICourse[]) {
  debug("starting to insert courses!");

  const rooms: Set<string> = new Set();
  const courseSubjects: Set<string> = new Set();

  courses.forEach((course) => {
    courseSubjects.add(course.subject.name);
    course.sections.forEach((section) => {
      section.slots.forEach((slot) => {
        if (slot.room) {
          rooms.add(slot.room.name);
        }
      });
    });
  });

  await db.serializable(pool, async (tx) => {
    const courseInfoCount = await db.count("course_info", db.all).run(tx);

    if (courseInfoCount !== 0) {
      console.log("course infos existed while about to insert");
      return;
    }

    await Promise.all([
      ...Array.from(rooms).map(async (room) => {
        const res = await db.selectOne("room", { name: room }).run(tx);

        if (res === undefined) {
          await db.insert("room", { name: room }).run(tx);
        }
      }),
      ...Array.from(courseSubjects).map(async (courseSubject) => {
        const res = await db
          .selectOne("course_subject", { name: courseSubject })
          .run(tx);

        if (res === undefined) {
          await db.insert("course_subject", { name: courseSubject }).run(tx);
        }
      }),
    ]);
  });

  debug("done inserting courses!");
}
