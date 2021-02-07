import { ISemester } from "../../database/models/semester";

import fetchData from "./fetch-data";
import parseData from "./parse-data";

export const tempInvoke = async () => {
  const semester: ISemester = {
    year: 2020,
    term: 2,
    level: 1,
  };

  const testData = await fetchData(semester);
  parseData(semester, testData);
};
