import mongoose, { Schema, Document } from "mongoose";

import { SemesterSchema } from "./semester";

export interface ISession {
  name: string;
}

export interface ISessionDocument extends Document, ISession {}

export const SessionSchema = new Schema({
  semester: SemesterSchema,
  name: { type: String, required: true },
});

export default mongoose.model<ISessionDocument>("Session", SessionSchema);
