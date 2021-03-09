import { use } from "chai";
import chaiAsPromised from "chai-as-promised";

import { MONGO_TEST_DATABASE } from "../src/backend/config";
import {
  connect,
  database,
  disconnect,
  dropDatabase,
} from "../src/backend/database";
import insertCourseData from "../src/backend/scrape/banner/insert";
import parseCourseData from "../src/backend/scrape/banner/parse-data";
import {
  parsePeopleData,
  convertPeopleData,
  insertPeople,
} from "../src/backend/scrape/people";
import {
  fakePeopleApiResp,
  testSemester1,
  testSemester1Data,
  testSemester2,
  testSemester2Data,
} from "./test-data";

use(chaiAsPromised);

before(async function () {
  this.timeout(1000 * 30); // takes longer to init since it parses & inserts

  console.log("connecting to db before running tests...");

  await connect(MONGO_TEST_DATABASE, true);

  console.log("connected to db, populating with test semesters and people");
  await insertCourseData(
    parseCourseData(testSemester1, testSemester1Data.split("\n"))
  );
  await insertCourseData(
    parseCourseData(testSemester2, testSemester2Data.split("\n"))
  );

  const parsed = parsePeopleData(fakePeopleApiResp);
  const people = await convertPeopleData(parsed);
  await insertPeople(people);

  console.log("all test data inserted :), running tests!");
  console.log("\n---\n");
});

after(async () => {
  console.log("\n---\n");

  await dropDatabase();

  console.log("closing db");
  await disconnect();
  console.log("done!");
});
