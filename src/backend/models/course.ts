import mongoose, { Schema, Document } from "mongoose";

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
  byCrn(): ICourse;
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

const Course = mongoose.model<ICourseDocument>("Course", CourseSchema);

export default Course;
