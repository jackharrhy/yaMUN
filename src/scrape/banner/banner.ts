import type { ICourse, ISemester } from "../../types";
import { fetchCourseData } from "./fetch-data";
import { parseCoursePageData } from "./parse-page-data";

export const getCoursesFromSemester = async (
  semester: ISemester
): Promise<ICourse[] | null> => {
  const unprocessedData = await fetchCourseData(semester);
  return parseCoursePageData(semester, unprocessedData);
};
