import { Schema } from "mongoose";

export interface ISemester {
  year: number;
  term: number;
  level: number;
}

export const SemesterSchema = new Schema({
  year: { type: Number, required: true },
  term: { type: Number, required: true },
  level: { type: Number, required: true },
});
