import debugFactory from "debug";
import * as db from "zapatos/db";

import pool from "../../db/pool";
import { ICourseInfo } from "../../types";

const debug = debugFactory("scrape/calendar/insert");

export const insertCourseInfo = async (courseInfos: ICourseInfo[]) => {
  debug("starting to course-info...");

  const subjects: Set<string> = new Set();
  const numbers: Set<string> = new Set();

  courseInfos.forEach((courseInfo) => {
    subjects.add(courseInfo.subject.name);
    numbers.add(courseInfo.number.name);
  });

  await db.serializable(pool, async (tx) => {
    const courseInfoCount = await db.count("course_info", db.all).run(tx);

    if (courseInfoCount !== 0) {
      console.log("course infos existed while about to insert");
      return;
    }

    await Promise.all([
      ...Array.from(subjects).map(async (subject) => {
        const res = await db.selectOne("subject", { name: subject }).run(tx);

        if (res === undefined) {
          await db.insert("subject", { name: subject }).run(tx);
        }
      }),
      ...Array.from(numbers).map(async (number) => {
        const res = await db
          .selectOne("course_number", { name: number })
          .run(tx);

        if (res === undefined) {
          await db.insert("course_number", { name: number }).run(tx);
        }
      }),
    ]);

    await Promise.all(
      courseInfos.map(async (courseInfo) => {
        await db
          .insert("course_info", [
            {
              subject: courseInfo.subject.name,
              number: courseInfo.number.name,
              title: courseInfo.title,
              description: courseInfo.description,
              attributes: courseInfo.attributes,
            },
          ])
          .run(tx);
      })
    );
  });

  debug("done inserting course-info!");
};
