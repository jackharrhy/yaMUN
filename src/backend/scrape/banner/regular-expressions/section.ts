import { JSONSchemaType } from "ajv";

import { ISection } from "../../../models/section";
import { handleMatch } from "../../../utils/ajv";
import { stringToBool, stringToNumber } from "../../../utils/misc";

export const SECTION_REGEX = /^.{37} (?<section>(\d|[A-Z]){3}) (?<crn>\d{5}) .{38}((?<scheduleType>([A-Z]|&){3})|   )   .{11} (?<phoneOne>Y|N|D|A) (?<phoneTwo>Y|N|D|A)  (?<waitList>Y|N)   (?<preCheck>Y|N)    ((?<reserved>Y|N|D)| )   (?<attr>(L|Q|W|G|R| ){5}) (?<creditHours>( |\d){3})  (?<billedHours>(( |\d){3})| NA)  ((Primary - (?<primaryInstructor>[A-Z] (\w| ){11}) ((?<secondaryInstructor>[A-Z] (\w| ){11})|.*))|.*)/;

interface ISectionMatch {
  section: string;
  crn: string;
  scheduleType: string | null;
  phoneOne: string;
  phoneTwo: string;
  waitList: string;
  preCheck: string;
  reserved: string | null;
  attr: string;
  creditHours: string;
  billedHours: string;
  primaryInstructor: string | null;
  secondaryInstructor: string | null;
}

const sectionSchema: JSONSchemaType<ISectionMatch> = {
  type: "object",
  properties: {
    section: { type: "string" },
    crn: { type: "string" },
    scheduleType: { type: "string" },
    phoneOne: { type: "string" },
    phoneTwo: { type: "string" },
    waitList: { type: "string" },
    preCheck: { type: "string" },
    reserved: { type: "string" },
    attr: { type: "string" },
    creditHours: { type: "string" },
    billedHours: { type: "string" },
    primaryInstructor: { type: "string" },
    secondaryInstructor: { type: "string" },
  },
  required: [
    "section",
    "crn",
    "phoneOne",
    "phoneTwo",
    "waitList",
    "preCheck",
    "attr",
    "creditHours",
    "billedHours",
  ],
  additionalProperties: false,
};

export function matchToSection(match: RegExpExecArray): ISection {
  const sectionMatch = handleMatch(sectionSchema, match);

  return {
    ...sectionMatch,
    primaryInstructor: sectionMatch.primaryInstructor?.trim() ?? null,
    secondaryInstructor: sectionMatch.secondaryInstructor?.trim() ?? null,
    crn: parseInt(sectionMatch.crn, 10),
    waitList: stringToBool(sectionMatch.waitList),
    preCheck: stringToBool(sectionMatch.preCheck),
    creditHours: stringToNumber(sectionMatch.creditHours),
    billedHours: stringToNumber(sectionMatch.billedHours),
    slots: [],
  };
}
