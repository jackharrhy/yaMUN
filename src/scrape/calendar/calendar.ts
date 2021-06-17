import debugFactory from "debug";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";

import { ICourseInfo } from "../../types";
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

export const parseListingsPage = (
  subject: string,
  data: string
): ICourseInfo[] => {
  const dom = new JSDOM(data);

  const divs = Array.from(
    dom.window.document.querySelectorAll(".course")
  ) as HTMLDivElement[];

  const courseInfos: ICourseInfo[] = [];

  for (const div of divs) {
    const numberElm: HTMLParagraphElement | null =
      div.querySelector(".courseNumber");
    const titleElm: HTMLParagraphElement | null =
      div.querySelector(".courseTitle");

    if (numberElm === null || titleElm === null) {
      throw new Error("failed to parse course div");
      continue;
    }

    const descriptionElm: HTMLDivElement | null =
      div.querySelector(".courseDesc");
    const attributesElms: HTMLParagraphElement[] = Array.from(
      div.querySelectorAll(".courseAttrs")
    );

    const number = numberElm.textContent?.trim();
    const title = titleElm.textContent?.trim();

    if (number === undefined || title === undefined) {
      throw new Error("failed to parse members of course div");
    }

    const description = descriptionElm?.textContent?.trim() ?? "No Description";

    const attributes = attributesElms?.map((elm) => {
      return elm?.textContent?.trim() ?? "";
    });

    debug("course", subject, number, title);

    courseInfos.push({
      subject: { name: subject },
      number: { name: number },
      title,
      description,
      attributes,
    });
  }

  return courseInfos;
};

export const insertCourseInfo = async (courseInfo: ICourseInfo[]) => {
  debug("starting to course-info...");
  // TODO insert course info
  // await CourseInfo.create(courseInfo);
  debug("done inserting course-info!");
};

export const populateCourseInfo = async () => {
  // TODO check for existing course info
  const existingCourseInfo = null;

  if (existingCourseInfo === null) {
    console.log("populating course-info...");
    const allCourseInfo = (
      await Promise.all(
        Object.entries(LISTINGS).map(async ([subject, sectionNumbers]) => {
          return await Promise.all(
            sectionNumbers.map(async (sectionNumber) => {
              const data = await fetchListingBySectionNo(sectionNumber);
              const courseInfos = parseListingsPage(subject, data);
              console.log(
                `found ${courseInfos.length} course-infos from ${subject}`
              );
              return courseInfos;
            })
          );
        })
      )
    ).flat(2);

    const dedupedCourseInfo: { [key: string]: ICourseInfo | undefined } = {};

    allCourseInfo.forEach((courseInfo) => {
      const key = `${courseInfo.subject}${courseInfo.number}`;

      if (dedupedCourseInfo.hasOwnProperty(key)) {
        debug("duplicate course", key);
        if (courseInfo.description.startsWith("(see description")) {
          debug("skipping, since starts with (");
          return;
        } else {
          debug("not skipping");
        }
      }

      dedupedCourseInfo[key] = courseInfo;
    });

    await insertCourseInfo(
      Object.values(dedupedCourseInfo).filter(
        (v): v is ICourseInfo => v !== undefined
      )
    );

    console.log("populated course-info!");
  } else {
    console.log("no need to populate course-info, already existing data");
  }
};
