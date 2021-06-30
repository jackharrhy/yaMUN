import debugFactory from "debug";
import fetch from "node-fetch";
import { URLSearchParams } from "url";

import { ISemester } from "../../types";

const debug = debugFactory("scrape/banner/fetch-data");

const HEADERS = {
  "User-Agent": "github.com/jackharrhy/yamun - src/backend/scrape/banner",
  Accept: "text/html",
  "Content-Type": "application/x-www-form-urlencoded",
};

const ENDPOINT = "https://www5.mun.ca/admit/hwswsltb.P_CourseResults";

const fetchCourseData = async ({ year, term, level }: ISemester) => {
  // TODO handle caching
  /*
  const cached: IBannerCacheDocument | null = await BannerCache.findOne({
    year,
    term,
    level,
  }).exec();

  if (cached !== null) {
    debug("cached", year, term, level);
    return cached.data;
  }
  */

  debug("fresh", year, term, level);

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

  /*
  await BannerCache.create({
    year,
    term,
    level,
    data,
  });
  */

  return data;
};

export default fetchCourseData;
