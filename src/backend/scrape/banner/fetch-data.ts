import fetch from "node-fetch";
import { URLSearchParams } from "url";

import BannerCache, { IBannerCacheDocument } from "../../models/banner-cache";
import { ISemester } from "../../models/semester";

const HEADERS = {
  "User-Agent": "yamun",
  Accept: "text/html",
  "Content-Type": "application/x-www-form-urlencoded",
};

const ENDPOINT = "https://www5.mun.ca/admit/hwswsltb.P_CourseResults";

const fetchData = async ({ year, term, level }: ISemester) => {
  const cached: IBannerCacheDocument | null = await BannerCache.findOne({
    year,
    term,
    level,
  }).exec();
  if (cached !== null) return cached.data;

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

  await BannerCache.create({
    year,
    term,
    level,
    data,
  });

  return data;
};

export default fetchData;
