import mongoose, { Schema, Document } from "mongoose";

import { ISemester, ISemesterDocument, SemesterSchema } from "./semester";
import { ICampusDocument, CampusSchema, ICampus } from "./campus";
import { ISession, ISessionDocument, SessionSchema } from "./session";
import { ISection } from "./section";
import { ISubject, ISubjectDocument } from "./subject";

export interface ICourse {
  semester: ISemester;
  campus: ICampus;
  session: ISession;
  subject: ISubject;
  name: string;
  number: string;
  sections: ISection[];
}

export interface ICourseDocument extends Document, ICourse {
  semester: ISemesterDocument;
  campus: ICampusDocument;
  session: ISessionDocument;
  subject: ISubjectDocument;
}

export const CourseSchema = new Schema({
  semester: SemesterSchema,
  campus: CampusSchema,
  session: SessionSchema,
  subject: { type: String, required: true },
  name: { type: String, required: true },
  number: { type: String, required: true },
});

export default mongoose.model<ICourseDocument>("Course", CourseSchema);
