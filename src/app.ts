import pool from "./db/pool";
import { populateCourses } from "./scrape/banner/banner";
import { populateCourseInfo } from "./scrape/calendar/calendar";
import { populatePeople } from "./scrape/people/people";

(async () => {
  try {
    // await populateCourses();
    await populateCourseInfo();
    // await populatePeople();
    pool.end();
  } catch (err) {
    console.error(err);
  }
})();
