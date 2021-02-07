import mongoose, { Schema, Document } from "mongoose";

export interface ISubject {
  name: string;
}

export interface ISubjectDocument extends Document, ISubject {}

export const SubjectSchema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.model<ISubjectDocument>("Subject", SubjectSchema);
