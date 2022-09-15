import debugFactory from "debug";
import { JSDOM } from "jsdom";

import { ICourse, ISemester } from "../../types";
import { parseCourseData } from "./parse-data";

const debug = debugFactory("yamun:scrape/banner/parse-page-data");

export const parseCoursePageData = (
  semester: ISemester,
  data: string
): ICourse[] | null => {
  const dom = new JSDOM(data);
  const pre: HTMLPreElement | null = dom.window.document.querySelector("pre");

  if (pre === null) {
    debug("failed to parse", data);
    return null;
  }

  return parseCourseData(semester, (pre.textContent as string).split("\n"));
};
