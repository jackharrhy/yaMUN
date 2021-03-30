import { Schema, Document } from "mongoose";

export const semesterToString = (semester: ISemester): string => {
  let letter: string;

  if (semester.term === 1) {
    letter = "f";
  } else if (semester.term === 2) {
    letter = "w";
  } else if (semester.term === 3) {
    letter = "s";
  } else {
    throw new Error("invalid semester");
  }

  let postfix = "";
  if (semester.level === 2) {
    postfix = "g";
  }

  return `${letter}${semester.year}${postfix}`;
};

export interface ISemester {
  year: number;
  term: number;
  level: number;
}

export interface ISemesterDocument extends Document, ISemester {}

/** equality is based on years and terms being equal, level is ignored */
export function semestersEqual(a: ISemester, b: ISemester): boolean {
  return a.year === b.year && a.term === b.term;
}

export const SemesterSchema = new Schema<ISemesterDocument>({
  year: { type: Number, required: true },
  term: { type: Number, required: true },
  level: { type: Number, required: true },
});
