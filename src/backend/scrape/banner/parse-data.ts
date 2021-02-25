import { JSDOM } from "jsdom";

import { COURSE_REGEX, matchToCourse } from "./regular-expressions/course";
import { SECTION_REGEX, matchToSection } from "./regular-expressions/section";
import { SLOT_REGEX, matchToSlot } from "./regular-expressions/slot";
// import { LAB_SECTION_REGEX, matchToLabSection } from "./regular-expressions/lab-section";

import { ISemester } from "../../database/models/semester";
import { ICampus } from "../../database/models/campus";
import { ISession } from "../../database/models/session";
import { ISubject } from "../../database/models/subject";
import { ICourse } from "../../database/models/course";
import { ISection } from "../../database/models/section";
import { ISlot } from "../../database/models/slot";

const parseData = (semester: ISemester, data: string): ICourse[] => {
  const dom = new JSDOM(data);
  const pre = dom.window.document.querySelector("pre");

  let campus: ICampus | null = null;
  let session: ISession | null = null;
  let subject: ISubject | null = null;

  let course: ICourse | null = null;
  let section: ISection | null = null;
  let slot: ISlot | null = null;

  const courses: ICourse[] = [];

  for (const line of pre.textContent.split("\n")) {
    const trimmed = line.trim();

    if (trimmed.startsWith("Campus: ")) {
      const name = trimmed.slice("Campus: ".length);
      campus = { name };
      course = null;
      section = null;
      slot = null;
      continue;
    }

    if (trimmed.startsWith("Session: ")) {
      const name = trimmed.slice("Session: ".length);
      session = { name };
      course = null;
      section = null;
      slot = null;
      continue;
    }

    if (trimmed.startsWith("Subject: ")) {
      const name = trimmed.slice("Subject: ".length);
      subject = { name };
      course = null;
      section = null;
      slot = null;
      continue;
    }

    const courseMatch = COURSE_REGEX.exec(line);
    if (courseMatch !== null) {
      if (course !== null) {
        courses.push(course);
      }

      if (campus !== null && session !== null && subject !== null) {
        course = matchToCourse(semester, campus, session, courseMatch);
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
      if (section !== null) {
        if (course !== null) {
          course.sections.push(section);
        } else {
          throw new Error("Found section before finding course");
        }
      }

      section = matchToSection(sectionMatch);
    } else {
      if (courseMatch !== null) {
        throw new Error("Matched course without section");
      }
    }

    const slotMatch = SLOT_REGEX.exec(line);
    if (slotMatch !== null) {
      if (slot !== null) {
        if (section !== null) {
          section.slots.push(slot);
        } else {
          throw new Error("Found slot before finding section");
        }
      }

      slot = matchToSlot(slotMatch);
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

  return courses;
};

export default parseData;
