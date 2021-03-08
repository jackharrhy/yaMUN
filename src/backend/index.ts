import { Connection } from "mongoose";

import api from "./api";
import { connect } from "./database";
import Course from "./models/course";
import { ISemester } from "./models/semester";
import { insertSemester } from "./scrape/banner/insert";
import { populatePeople } from "./scrape/people";

const populateTestSemester = async () => {
  const existingCourse = await Course.findOne({}).exec();

  if (existingCourse === null) {
    console.log("populating test semester...");
    const testSemester: ISemester = {
      year: 2019,
      term: 2,
      level: 1,
    };

    await insertSemester(testSemester);
    console.log("populated test semester!");
  } else {
    console.log("no need to populate test semester, already existing data");
  }
};

(async () => {
  try {
    await connect();
    const { listen } = api();

    await populatePeople();
    await populateTestSemester();
    listen();
  } catch (err) {
    console.error(err);
  }
})();
