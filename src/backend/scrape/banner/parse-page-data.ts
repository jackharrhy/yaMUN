import { JSDOM } from "jsdom";

import { ICourse } from "../../models/course";
import { ISemester } from "../../models/semester";
import parseCourseData from "./parse-data";

const parseCoursePageData = (semester: ISemester, data: string): ICourse[] => {
  const dom = new JSDOM(data);
  const pre = dom.window.document.querySelector("pre") as HTMLPreElement;
  return parseCourseData(semester, (pre.textContent as string).split("\n"));
};

export default parseCoursePageData;
