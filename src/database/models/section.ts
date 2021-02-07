import { JSONSchemaType } from "ajv";

export interface ISection {
  section: string;
  crn: number;
  scheduleType: string;
  phoneOne: string; // TODO enum
  phoneTwo: string; // TODO enum
  waitList: boolean;
  preCheck: boolean;
  reserved: string; // TODO enum
  attr: string; // TODO enum
  creditHours: number;
  billedHours: number;
  primaryInstructor: string;
  secondaryInstructor: string;
}

export const courseSchema: JSONSchemaType<ISection> = {
  type: "object",
  properties: {
    section: { type: "string" },
    crn: { type: "number" },
    scheduleType: { type: "string" },
    phoneOne: { type: "string" },
    phoneTwo: { type: "string" },
    waitList: { type: "boolean" },
    preCheck: { type: "boolean" },
    reserved: { type: "string" },
    attr: { type: "string" },
    creditHours: { type: "number" },
    billedHours: { type: "number" },
    primaryInstructor: { type: "string" },
    secondaryInstructor: { type: "string" },
  },
  required: [
    "section",
    "crn",
    "scheduleType",
    "phoneOne",
    "phoneTwo",
    "waitList",
    "preCheck",
    "reserved",
    "attr",
    "creditHours",
    "billedHours",
    "primaryInstructor",
    "secondaryInstructor",
  ],
  additionalProperties: false,
};
