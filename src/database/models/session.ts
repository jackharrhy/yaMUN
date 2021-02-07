import mongoose, { Schema, Document } from "mongoose";

import { SemesterSchema } from "./semester";

export interface ISession {
  name: String;
}

export interface ISessionDocument extends Document, ISession {}

export const SessionSchema = new Schema({
  semester: SemesterSchema,
  name: { type: String, required: true },
});

export default mongoose.model<ISessionDocument>("Session", SessionSchema);
