import debugFactory from "debug";

import { COURSE_REGEX, matchToCourse } from "./regular-expressions/course";
import { SECTION_REGEX, matchToSection } from "./regular-expressions/section";
import { SLOT_REGEX, matchToSlot } from "./regular-expressions/slot";
// import { LAB_SECTION_REGEX, matchToLabSection } from "./regular-expressions/lab-section";

import { ISemester } from "../../models/semester";
import { ICourse } from "../../models/course";
import { ISection } from "../../models/section";
import { ISlot } from "../../models/slot";

const debug = debugFactory("backend/scrape/banner/parse-data");

const parseData = (semester: ISemester, data: string[]): ICourse[] => {
  debug("starting!");
  let campus: string | null = null;
  let session: string | null = null;
  let subject: string | null = null;

  let course: ICourse | null = null;
  let section: ISection | null = null;
  let slot: ISlot | null = null;

  const courses: ICourse[] = [];

  for (const line of data) {
    debug("line", line);

    const trimmed = line.trim();

    if (trimmed.startsWith("Campus: ")) {
      campus = trimmed.slice("Campus: ".length);
      debug("campus", campus);
      course = null;
      section = null;
      slot = null;
      continue;
    }

    if (trimmed.startsWith("Session: ")) {
      session = trimmed.slice("Session: ".length);
      debug("session", campus);
      course = null;
      section = null;
      slot = null;
      continue;
    }

    if (trimmed.startsWith("Subject: ")) {
      subject = trimmed.slice("Subject: ".length);
      debug("subject", subject);
      course = null;
      section = null;
      slot = null;
      continue;
    }

    const courseMatch = COURSE_REGEX.exec(line);
    if (courseMatch !== null) {
      if (campus !== null && session !== null && subject !== null) {
        course = matchToCourse(semester, campus, session, courseMatch);
        debug("course", course.number);
        courses.push(course);
      } else {
        throw new Error(
          "Attempted to construct course but campus/session/subject was null"
        );
      }
    } else {
      // handle course failure?
    }

    const sectionMatch = SECTION_REGEX.exec(line);
    if (sectionMatch !== null) {
      if (course !== null) {
        section = matchToSection(sectionMatch);
        debug("section", section.crn);
        course.sections.push(section);
      } else {
        // ignore for now because its kinda broken with some entries
        // throw new Error("Found section before finding course");
      }
    } else {
      if (courseMatch !== null) {
        // ignore for now because its kinda broken with some entries
        // throw new Error("Matched course without section");
      }
    }

    const slotMatch = SLOT_REGEX.exec(line);
    if (slotMatch !== null) {
      if (section !== null) {
        slot = matchToSlot(slotMatch);
        debug("slot", slot.slot);
        section.slots.push(slot);
      } else {
        // ignore for now because its kinda broken with some entries
        // throw new Error("Found slot before finding section");
      }
    } else {
      if (sectionMatch !== null) {
        throw new Error("Matched section without slot");
      }
    }

    // TODO match lab section

    const matchedNothing =
      courseMatch === null && sectionMatch === null && slotMatch === null;

    if (matchedNothing) {
      // TODO handle no match, assume is either meta or context markings
    }
  }

  debug("done!");
  return courses;
};

export default parseData;
