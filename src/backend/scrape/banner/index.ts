import debugFactory from "debug";

import { YEAR_TO_START_FETCHING_COURSES_FROM } from "../../config";
import Course, { ICourse } from "../../models/course";
import { ISemester } from "../../models/semester";
import fetchCourseData from "./fetch-data";
import insertCourses from "./insert";
import parsePageData from "./parse-page-data";

const debug = debugFactory("backend/scrape/banner");

const TERMS = [1, 2, 3];
const LEVELS = [1, 2];

export const coursesFromSemester = async (
  semester: ISemester
): Promise<ICourse[] | null> => {
  const unprocessedData = await fetchCourseData(semester);
  return parsePageData(semester, unprocessedData);
};

export async function populateCourses() {
  const existingCourse = await Course.findOne({}).exec();

  if (existingCourse === null) {
    console.log("populating courses...");
    const minYear = YEAR_TO_START_FETCHING_COURSES_FROM;
    const curYear = new Date().getFullYear();
    const maxYear = curYear + 2;

    const years = [...Array(maxYear - minYear).keys()].map(
      (y) => y + YEAR_TO_START_FETCHING_COURSES_FROM
    );

    const insertionPromises = [];

    outer: for (const year of years) {
      for (const term of TERMS) {
        for (const level of LEVELS) {
          const semester: ISemester = { year, term, level };
          console.log("semester", semester);
          const courses = await coursesFromSemester(semester);

          if (courses === null) {
            if (year < curYear) {
              console.log("semester produced no courses, but was before current year");
            } else {
              console.log(
                "stopped parsing at ",
                semester,
                ", found no more course data"
              );
              break outer;
            }
          } else {
            insertionPromises.push(insertCourses(courses));
          }
        }
      }
    }

    await Promise.all(insertionPromises);
    console.log("populated courses!");
  } else {
    console.log("no need to populate test semester, already existing data");
  }
}
