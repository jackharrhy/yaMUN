import mongoose, { Schema, Document, Model } from "mongoose";

import { ISection, SectionSchema } from "./section";
import { ISemester, SemesterSchema } from "./semester";

export interface ICourse {
  semester: ISemester;
  campus: string;
  session: string;
  subject: string;
  name: string;
  number: string;
  sections: ISection[];
}

export interface ICourseDocument extends Document, ICourse {
  findOneByCrn(crn: Number): ICourse;
}

export interface ICourseModel extends Model<ICourseDocument> {
  findOneByCrn(crn: Number): ICourse;
}


export const CourseSchema = new Schema({
  semester: SemesterSchema,
  campus: { type: String, required: true },
  session: { type: String, required: true },
  subject: { type: String, required: true },
  name: { type: String, required: true },
  number: { type: String, required: true },
  sections: [SectionSchema],
});

CourseSchema.statics.findOneByCrn = (async function(crn: Number) {
  return await this.findOne({
    sections: { $elemMatch: { crn } },
  }).exec();
});

const Course = mongoose.model<ICourseDocument, ICourseModel>("Course", CourseSchema);

export default Course;
