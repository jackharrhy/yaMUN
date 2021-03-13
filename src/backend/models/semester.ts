import { Schema, Document } from "mongoose";

export interface ISemester {
  year: number;
  term: number;
  level: number;
}

export interface ISemesterDocument extends Document, ISemester {}

export function semestersEqual(a: ISemester, b: ISemester): boolean {
  return a.year === b.year && a.term === b.term && a.level === b.level;
}

export const SemesterSchema = new Schema<ISemesterDocument>({
  year: { type: Number, required: true },
  term: { type: Number, required: true },
  level: { type: Number, required: true },
});
