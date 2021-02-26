import { JSDOM } from "jsdom";
import { ICourse } from "../../models/course";
import { ISemester } from "../../models/semester";
import parseData from "./parse-data";

const parsePageData = (semester: ISemester, data: string): ICourse[] => {
  const dom = new JSDOM(data);
  const pre = dom.window.document.querySelector("pre");

  return parseData(semester, pre.textContent.split("\n"));
};

export default parsePageData;
