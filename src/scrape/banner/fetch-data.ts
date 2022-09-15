import debugFactory from "debug";
import { URLSearchParams } from "url";

import { ISemester } from "../../types";

const debug = debugFactory("yamun:scrape/banner/fetch-data");

const HEADERS = {
  "User-Agent": "github.com/jackharrhy/yamun - src/scrape/banner",
  Accept: "text/html",
  "Content-Type": "application/x-www-form-urlencoded",
};

const ENDPOINT = "https://selfservice.mun.ca/direct/hwswsltb.P_CourseResults";

export const fetchCourseData = async ({ year, term, level }: ISemester) => {
  debug("fetch course data", year, term, level);

  const formData = {
    p_term: `${year}0${term}`,
    p_levl: `0${level}*00`,
    campus: "%",
    faculty: "%",
    prof: "%",
    crn: "%",
  };

  const response = await fetch(ENDPOINT, {
    headers: HEADERS,
    method: "post",
    body: new URLSearchParams(formData),
  });

  const data = await response.text();

  return data;
};
