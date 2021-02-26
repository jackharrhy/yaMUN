import { connect } from "./database";
import { ISemester } from "./models/semester";
import { coursesFromSemester } from "./scrape/banner";
import insertData from "./scrape/banner/insert-data";
import api from "./api";

async function test() {
  const testSemester: ISemester = {
    year: 2020,
    term: 2,
    level: 1,
  };

  const testCourses = await coursesFromSemester(testSemester);

  await insertData(testCourses);
}

(async () => {
  const { listen } = await api();

  await connect("development", "development", "localhost");

  try {
    await test();

    listen();
  } catch (err) {
    console.error(err);
  }
})();
