import { ICourse } from "../../models/course";
import { ISemester } from "../../models/semester";
import fetchCourseData from "./fetch-data";
import parsePageData from "./parse-page-data";

export const coursesFromSemester = async (
  semester: ISemester
): Promise<ICourse[]> => {
  const unprocessedData = await fetchCourseData(semester);
  return parsePageData(semester, unprocessedData);
};
