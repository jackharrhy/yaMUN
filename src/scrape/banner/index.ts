import { ISemester } from "../../database/models/semester";

import fetchData from "./fetch-data";
import parseData from "./parse-data";
import insertData from "./insert-data";

export const tempInvoke = async () => {
  const semester: ISemester = {
    year: 2020,
    term: 2,
    level: 1,
  };

  const unprocessedData = await fetchData(semester);
  const courses = parseData(semester, unprocessedData);
  await insertData(courses);
};
