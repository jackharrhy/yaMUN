import api from "./api";
import { connect } from "./database";
import Course from "./models/course";
import { ISemester } from "./models/semester";
import { insertSemester } from "./scrape/banner/insert";

const populateTestSemesterIfNoData = async () => {
  const existingCourses = await Course.find({}).exec();

  if (existingCourses.length === 0) {
    console.log("populating test semester...");
    const testSemester: ISemester = {
      year: 2019,
      term: 2,
      level: 1,
    };

    await insertSemester(testSemester);
    console.log("populated!");
  } else {
    console.log("no need to populate test semester, already existing data");
  }
};

(async () => {
  const db = await connect();
  const { listen } = api();

  try {
    await populateTestSemesterIfNoData();
    listen();
  } catch (err) {
    console.error(err);
    await db.close();
  }
})();
