import { JSDOM } from "jsdom";
import fs from "fs";

import {
  COURSE_REGEX,
  SECTION_REGEX,
  SLOT_REGEX,
  LAB_SECTION_REGEX,
} from "./regular-expressions";

const parseData = (data: string) => {
  const dom = new JSDOM(data);
  const pre = dom.window.document.querySelector("pre");

  let campus = null;
  let session = null;
  let subject = null;

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
    const didMatchCourse = courseMatch !== null;
    if (didMatchCourse) {
      // handle course match
    } else {
      // handle course failure?
    }

    const sectionMatch = SECTION_REGEX.exec(line);
    const didMatchSection = sectionMatch !== null;
    if (didMatchSection) {
      // handle section match
    } else {
      if (didMatchCourse) {
        throw new Error("Matched course without section");
      }
    }

    const slotMatch = SLOT_REGEX.exec(line);
    const didMatchSlot = slotMatch !== null;
    if (didMatchSlot) {
      // handle slot match
    } else {
      if (didMatchSection) {
        throw new Error("Matched section without slot");
      }
    }

    const matchedNothing = !(didMatchCourse || didMatchSection || didMatchSlot);
    if (matchedNothing) {
      // handle no match, assume is either meta or context markings
    }
  }
};

export default parseData;
