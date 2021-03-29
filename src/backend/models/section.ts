import { Schema, Document } from "mongoose";

import { ISemester, semesterToString } from "./semester";
import { ISlot, ISlotDocument, SlotSchema } from "./slot";

export const createSID = (semester: ISemester, crn: number) => {
  return `${semesterToString(semester)}-${crn}`;
};

export interface ISection {
  sid: string;
  section: string;
  crn: number;
  scheduleType: string | null; // TODO enum?
  phoneOne: string; // TODO enum
  phoneTwo: string; // TODO enum
  waitList: boolean;
  preCheck: boolean;
  reserved: string | null; // TODO enum
  attr: string; // TODO enum
  creditHours: number | null;
  billedHours: number | null;
  primaryInstructor: string | null;
  secondaryInstructor: string | null;
  slots: ISlot[];
}

export interface ISectionDocument extends Document, ISection {
  slots: ISlotDocument[];
}

export const SectionSchema = new Schema<ISectionDocument>({
  sid: { type: String, required: true },
  section: { type: String, required: true },
  crn: { type: Number, required: true },
  scheduleType: { type: String },
  phoneOne: { type: String, required: true },
  phoneTwo: { type: String, required: true },
  waitList: { type: Boolean, required: true },
  preCheck: { type: Boolean, required: true },
  reserved: { type: String },
  attr: { type: String, required: true },
  creditHours: { type: Number },
  billedHours: { type: Number },
  primaryInstructor: { type: String },
  secondaryInstructor: { type: String },
  slots: [SlotSchema],
});
