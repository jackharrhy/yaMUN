import { Schema } from "mongoose";

export interface ISemester {
  year: number;
  term: number;
  level: number;
}

export function semestersEqual(a: ISemester, b: ISemester): boolean {
  return a.year === b.year && a.term === b.term && a.level === b.level;
}

export const SemesterSchema = new Schema({
  year: { type: Number, required: true },
  term: { type: Number, required: true },
  level: { type: Number, required: true },
});
