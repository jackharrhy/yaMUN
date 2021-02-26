import { connect } from "./database";
import { ISemester } from "./database/models/semester";
import { coursesFromSemester } from "./scrape/banner";
import insertData from "./scrape/banner/insert-data";

async function test()  {
    const testSemester: ISemester = {
      year: 2020,
      term: 2,
      level: 1,
    };

    const testCourses = await coursesFromSemester(testSemester);

    await insertData(testCourses);
}

(async () => {
  await connect("development", "development", "localhost");
  try {
    await test();
  } catch (err) {
    console.error(err);
  }
})();
