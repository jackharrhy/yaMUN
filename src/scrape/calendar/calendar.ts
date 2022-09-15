import debugFactory from "debug";
import { JSDOM } from "jsdom";

import { ICourseInfo } from "../../types";
import { LISTING_BASE } from "./listings";

const debug = debugFactory("yamun:scrape/calendar/calendar");

const HEADERS = {
  "User-Agent": "github.com/jackharrhy/yamun - src/scrape/calendar",
};

// TODO is this used? should this be in misc.?
const courseInfoKey = (courseInfo: ICourseInfo) =>
  `${courseInfo.subject.name}${courseInfo.number.name}`;

const fetchListingBySectionNo = async (
  listingSectionNo: string
): Promise<any> => {
  const url = `${LISTING_BASE}${listingSectionNo}`;
  debug("url", url);
  const response = await fetch(url, { headers: HEADERS });
  return await response.text();
};

// TODO make subject optional / derive subject from data
const parseListingsPage = (subject: string, data: string): ICourseInfo[] => {
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

export const getListingsBySectionNo = async (
  listingSectionNo: string,
  subject: string
) =>
  parseListingsPage(subject, await fetchListingBySectionNo(listingSectionNo));
