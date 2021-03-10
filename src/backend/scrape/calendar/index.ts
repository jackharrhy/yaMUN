import debugFactory from "debug";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";

import { LISTINGS, LISTING_BASE } from "./listings";

const debug = debugFactory("backend/scrape/calendar");

const HEADERS = {
  "User-Agent": "github.com/jackharrhy/yamun - src/backend/scrape/calendar",
};

export const fetchListingBySectionNo = async (
  listingSectionNo: string
): Promise<any> => {
  const url = `${LISTING_BASE}${listingSectionNo}`;
  debug("url", url);
  const response = await fetch(url, { headers: HEADERS });
  return await response.text();
};

// TODO eventually parse all listings
const toParse = {
  COMP: LISTINGS.COMP,
};

export const parseListingsPage = (data: string) => {
  const dom = new JSDOM(data);

  const divs = Array.from(
    dom.window.document.querySelectorAll(".course")
  ) as HTMLDivElement[];

  for (const div of divs) {
    // TODO something fun with these divs
    console.log(div.textContent);
  }
};

export const populateCourseInfo = async () => {
  // const existingPeople = await People.findOne({}).exec();
  const existingCourseInfo = null;

  if (existingCourseInfo === null) {
    console.log("populating course-info...");
    await Promise.all(
      Object.entries(toParse).map(async ([dept, sectionNumbers]) => {
        for (const sectionNumber of sectionNumbers) {
          const data = await fetchListingBySectionNo(sectionNumber);
          parseListingsPage(data);
        }
      })
    );
    console.log("did stuff");
  } else {
    console.log("no need to populate course-info, already existing data");
  }
};
