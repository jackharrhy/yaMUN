import { JSDOM } from "jsdom";

import fetchData from "./fetch-data";
import parseData from "./parse-data";

export const tempInvoke = async () => {
  const testData = await fetchData(2020, 2, 1);
  parseData(testData);
};
