import { ISemester } from "../types";

export const stringToBool = (str: string): boolean => {
  if (str === "Y") return true;
  if (str === "N") return false;
  throw new Error(`Got invalid boolean: ${str}`);
};

export const stringToNumberOrNull = (str: string): number | null => {
  const converted = parseInt(str, 10);
  return Number.isInteger(converted) ? converted : null;
};

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

export const createSemesterId = (semester: ISemester, crn: number) => {
  return `${semesterToString(semester)}-${crn}`;
};

/** equality is based on years and terms being equal, level is ignored */
export const semestersEqual = (a: ISemester, b: ISemester): boolean =>
  a.year === b.year && a.term === b.term;
