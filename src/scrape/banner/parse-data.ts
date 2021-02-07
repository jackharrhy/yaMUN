import { JSDOM } from "jsdom";

import {
  COURSE_REGEX,
  SECTION_REGEX,
  SLOT_REGEX,
  LAB_SECTION_REGEX,
} from "./regular-expressions";

import { ISemester } from "../../database/models/semester";
import { ICampus } from "../../database/models/campus";
import { ISession } from "../../database/models/session";
import { ISubject } from "../../database/models/subject";
import { ICourse, courseSchema } from "../../database/models/course";
import { handleMatch } from "../../utils/ajv";

const parseData = (semester: ISemester, data: string) => {
  const dom = new JSDOM(data);
  const pre = dom.window.document.querySelector("pre");

  let campus: ICampus | null = null;
  let session: ISession | null = null;
  let subject: ISubject | null = null;

  let course: ICourse | null = null;

  let counter = 0;
  for (const line of pre.textContent.split("\n")) {
    const trimmed = line.trim();
    counter++;
    // if (counter > 50) break;

    if (trimmed.startsWith("Campus: ")) {
      campus = trimmed.slice("Campus: ".length);
      continue;
    }

    if (trimmed.startsWith("Session: ")) {
      session = trimmed.slice("Session: ".length);
      continue;
    }

    if (trimmed.startsWith("Subject: ")) {
      subject = trimmed.slice("Subject: ".length);
      continue;
    }

    const courseMatch = COURSE_REGEX.exec(line);
    if (courseMatch !== null) {
      // TODO package last course somehow
      course = handleMatch<ICourse>(courseSchema, courseMatch);
    } else {
      // handle course failure?
    }

    const sectionMatch = SECTION_REGEX.exec(line);
    if (sectionMatch !== null) {
      // handle section match
    } else {
      if (courseMatch !== null) {
        throw new Error("Matched course without section");
      }
    }

    const slotMatch = SLOT_REGEX.exec(line);
    if (slotMatch !== null) {
      // handle slot match
    } else {
      if (sectionMatch !== null) {
        throw new Error("Matched section without slot");
      }
    }

    const matchedNothing =
      courseMatch === null && sectionMatch === null && slotMatch === null;

    if (matchedNothing) {
      // handle no match, assume is either meta or context markings
    }
  }
};

export default parseData;
