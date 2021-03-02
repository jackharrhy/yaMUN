import { ClientSession } from "mongoose";

import { insertSemester } from "../src/backend/scrape/banner/insert";
import { database, connect } from "../src/backend/database";
import { ISemester } from "../src/backend/models/semester";

export const testSemesterCrns = [81797, 92771];

let session: ClientSession;

before(async function () {
  this.timeout(1000 * 30); // takes longer to init since it parses & inserts

  console.log("connecting to db before running tests...");
  await connect("development", "development", "localhost");

  console.log("connected to db, populating with test semester");
  const testSemester: ISemester = {
    year: 2019,
    term: 2,
    level: 1,
  };

  session = await database.startSession();
  session.startTransaction();
  await insertSemester(testSemester);
  console.log("test semester inserted, running tests!");
});

after(async () => {
  console.log("closing db");
  session.abortTransaction(); // don't persist things done in the transaction
  await database.close();
});
