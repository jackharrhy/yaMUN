import mongoose, { Schema, Document } from "mongoose";

import { ISemester, SemesterSchema } from "./semester";
import { ICampus, CampusSchema } from "./campus";
import { ISession, SessionSchema } from "./session";
import { ISubject, SubjectSchema } from "./subject";
import { ISection, SectionSchema } from "./section";

export interface ICourse {
  semester: ISemester;
  campus: ICampus;
  session: ISession;
  subject: ISubject;
  name: string;
  number: string;
  sections: ISection[];
}

export interface ICourseDocument extends Document, ICourse {}

export const CourseSchema = new Schema({
  semester: SemesterSchema,
  campus: CampusSchema,
  session: SessionSchema,
  subject: SubjectSchema,
  name: { type: String, required: true },
  number: { type: String, required: true },
  sections: [SectionSchema],
});

export default mongoose.model<ICourseDocument>("Course", CourseSchema);
