import { JSDOM } from "jsdom";

import { ICourse } from "../../models/course";
import { ISemester } from "../../models/semester";
import parseCourseData from "./parse-data";

const parseCoursePageData = (semester: ISemester, data: string): ICourse[] => {
  const dom = new JSDOM(data);
  const pre: HTMLPreElement | null = dom.window.document.querySelector("pre");

  if (pre === null) {
    throw new Error("attempted to parse course page data, but found no pre");
  }

  return parseCourseData(semester, (pre.textContent as string).split("\n"));
};

export default parseCoursePageData;
