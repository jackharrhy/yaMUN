import { ISemester } from "../../models/semester";
import { ICourse } from "../../models/course";
import fetchData from "./fetch-data";
import parsePageData from "./parse-page-data";

export const coursesFromSemester = async (
  semester: ISemester
): Promise<ICourse[]> => {
  const unprocessedData = await fetchData(semester);
  return parsePageData(semester, unprocessedData);
};
