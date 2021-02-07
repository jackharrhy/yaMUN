import { JSONSchemaType } from "ajv";

import { ICampus } from "../../../database/models/campus";
import { ICourse } from "../../../database/models/course";
import { ISemester } from "../../../database/models/semester";
import { ISession } from "../../../database/models/session";
import { ISubject } from "../../../database/models/subject";
import { handleMatch } from "../../../utils/ajv";

export const COURSE_REGEX = /^(?<subject>([A-Z]|&|\.| ){4}) (?<number>(\d|[A-Z]){4}) (?<name>.{27})/;

interface ICourseMatch {
  subject: string;
  name: string;
  number: string;
}

const courseSchema: JSONSchemaType<ICourseMatch> = {
  type: "object",
  properties: {
    subject: { type: "string" },
    name: { type: "string" },
    number: { type: "string" },
  },
  required: ["subject", "name", "number"],
  additionalProperties: false,
};

export function matchToCourse(
  semester: ISemester,
  campus: ICampus,
  session: ISession,
  match: RegExpExecArray
): ICourse {
  const courseMatch = handleMatch(courseSchema, match);

  return {
    semester,
    campus,
    session,
    ...courseMatch,
    subject: { name: courseMatch.subject },
    sections: [],
  };
}
