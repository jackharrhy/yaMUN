import { JSONSchemaType } from "ajv";
import mongoose, { Schema, Document } from "mongoose";

import { ISemesterDocument, SemesterSchema } from "./semester";
import { ICampusDocument, CampusSchema } from "./campus";
import { ISessionDocument, SessionSchema } from "./session";

export interface ICourse {
  subject: string;
  name: string;
  number: string;
}

export const courseSchema: JSONSchemaType<ICourse> = {
  type: "object",
  properties: {
    subject: { type: "string" },
    name: { type: "string" },
    number: { type: "string" },
  },
  required: ["subject", "name", "number"],
  additionalProperties: false,
};

export interface ICourseDocument extends Document, ICourse {
  semester: ISemesterDocument;
  campus: ICampusDocument;
  session: ISessionDocument;
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