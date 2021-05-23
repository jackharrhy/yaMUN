require("isomorphic-fetch");

export {
  semestersEqual,
  createSemesterId,
  semesterToString,
} from "./utils/misc";

export type {
  ISemester,
  ICampus,
  ISession,
  ISubject,
  ICourseNumber,
  ICourse,
  ICourseInfo,
  ISection,
  IRoom,
  ISlot,
  IDepartment,
  IPeople,
} from "./types";
export { DayOfWeek } from "./types";

export { getPeopleData } from "./scrape/people/people";

export { LISTINGS, LISTING_BASE } from "./scrape/calendar/listings";
export { getListingsBySectionNo } from "./scrape/calendar/calendar";

export { getCoursesFromSemester } from "./scrape/banner/banner";
