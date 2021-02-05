import { JSDOM } from "jsdom";
import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv();

import {
  COURSE_REGEX,
  SECTION_REGEX,
  SLOT_REGEX,
  LAB_SECTION_REGEX,
} from "./regular-expressions";
import { ICourse } from "../../database/models/course";

const courseSchema: JSONSchemaType<ICourse> = {
  type: "object",
  properties: {
    subject: { type: "string" },
    name: { type: "string" },
    number: { type: "string" },
  },
  required: ["subject", "name", "number"],
  additionalProperties: false,
};

const validateCourse = ajv.compile(courseSchema);

function handleCourseMatch(courseMatch: RegExpExecArray): ICourse {
  if (validateCourse(courseMatch.groups)) {
    return courseMatch.groups;
  }
  throw JSON.stringify(validateCourse.errors, null, 2);
}

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
    if (courseMatch !== null) {
      console.log(courseMatch);
      const course = handleCourseMatch(courseMatch);
      console.log(course);
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
