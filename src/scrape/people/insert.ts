import debugFactory from "debug";
import * as db from "zapatos/db";

import pool from "../../db/pool";
import { IPeople } from "../../types";

const debug = debugFactory("scrape/people/insert");

export const insertPeople = async (people: IPeople[]) => {
  debug("starting to insert people...");

  const campuses: Set<string> = new Set();
  const departments: Set<string> = new Set();

  people.forEach((person) => {
    campuses.add(person.campus.name);
    departments.add(person.department.name);
  });

  await db.serializable(pool, async (tx) => {
    const peopleCount = await db.count("people", db.all).run(tx);

    if (peopleCount !== 0) {
      console.log("people existed while about to insert");
      return;
    }

    await Promise.all([
      ...Array.from(campuses).map(async (campus) => {
        const res = await db
          .selectOne("people_campus", { name: campus })
          .run(tx);

        if (res === undefined) {
          await db.insert("people_campus", { name: campus }).run(tx);
        }
      }),
      ...Array.from(departments).map(async (department) => {
        const res = await db
          .selectOne("people_department", { name: department })
          .run(tx);

        if (res === undefined) {
          await db.insert("people_department", { name: department }).run(tx);
        }
      }),
    ]);

    await Promise.all(
      people.map(async (person) => {
        await db
          .insert("people", [
            {
              banner_name: person.bannerName,
              display_name: person.displayName,
              campus: person.campus.name,
              department: person.department.name,
              title: person.title,
              first_name: person.firstName,
              last_name: person.lastName,
              extension: person.extension,
              location: person.location,
              email: person.email,
            },
          ])
          .run(tx);
      })
    );
  });

  debug("done inserting people!");
};
