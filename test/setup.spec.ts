import { use } from "chai";
import chaiAsPromised from "chai-as-promised";

import { connect, disconnect } from "../src/backend/database";
import insertData from "../src/backend/scrape/banner/insert";
import parseData from "../src/backend/scrape/banner/parse-data";
import {
  testSemester1,
  testSemester1Data,
  testSemester2,
  testSemester2Data,
} from "./test-data";

use(chaiAsPromised);

before(async function () {
  this.timeout(1000 * 30); // takes longer to init since it parses & inserts

  console.log("connecting to db before running tests...");
  await connect();

  console.log("connected to db, populating with test semesters");
  await insertData(parseData(testSemester1, testSemester1Data.split("\n")));
  await insertData(parseData(testSemester2, testSemester2Data.split("\n")));

  console.log("test semesters inserted, running tests!");
  console.log("\n---\n");
});

after(async () => {
  console.log("\n---\n");
  console.log("closing db");
  await disconnect();
  console.log("done!");
});
