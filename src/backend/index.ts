import api from "./api";
import { connect, disconnect } from "./database";
import { populateCourses } from "./scrape/banner";
import { populateCourseInfo } from "./scrape/calendar";
import { populatePeople } from "./scrape/people";

(async () => {
  try {
    await connect();
    const { listen } = api();

    await populateCourses();
    await populateCourseInfo();
    await populatePeople();

    listen();
  } catch (err) {
    console.error(err);
    await disconnect();
  }
})();
