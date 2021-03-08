import mongoose, { Schema, Document, Model } from "mongoose";
import debugFactory from "debug";

import { ISlot, SlotSchema } from "./slot";

const debug = debugFactory("backend/models/section");

export interface ISection {
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

export interface ISectionDocument extends Document, ISection {}

export interface ISectionModel extends Model<ISectionDocument> {
  findOneByCrn(crn: number): Promise<ISection | null>;
}

export const SectionSchema = new Schema({
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

SectionSchema.statics.findOneByCrn = async function (
  crn: number
): Promise<ISection> {
  debug("findOneByCrn", crn);
  return await this.findOne({
    sections: { $elemMatch: { crn } },
  }).exec();
};


const Course = mongoose.model<ISectionDocument, ISectionModel>(
  "Section",
  SectionSchema
);

export default Course;