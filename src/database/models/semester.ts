import mongoose, { Schema, Document } from "mongoose";
export interface ISemester {
  year: number;
  term: number;
  level: number;
}

export interface ISemesterDocument extends Document, ISemester {}

export const SemesterSchema = new Schema({
  year: { type: Number, required: true },
  term: { type: Number, required: true },
  level: { type: Number, required: true },
});

export default mongoose.model<ISemesterDocument>("Semester", SemesterSchema);
