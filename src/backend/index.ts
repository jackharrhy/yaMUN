import api from "./api";
import { connect } from "./database";
import { ISemester } from "./models/semester";
import { insertSemester } from "./scrape/banner/insert";

(async () => {
  const { listen } = api();
  const db = await connect();

  try {
    // For now, just populate with this test semester
    const testSemester: ISemester = {
      year: 2019,
      term: 2,
      level: 1,
    };

    await insertSemester(testSemester);

    listen();
  } catch (err) {
    console.error(err);
    await db.close();
  }
})();
