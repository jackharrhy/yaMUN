import { action, Action, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy";
import { toast } from "react-hot-toast";

import { IStore } from ".";
import { IPossibleFilters } from "../../../backend/api/controllers/courses";
import { ICourseDocument } from "../../../backend/models/course";
import { api, ErrorResponse } from "../api";

export type ICourseFilters = {
  page?: number;
  semesterYear?: number;
  semesterTerm?: number;
  semesterLevel?: number;
  subject?: string;
  number?: string;
};
export interface IStoreCourseFields {
  courses?: ICourseDocument[];
  setCourses: Action<IStore, ICourseDocument[]>;
  courseFilters?: ICourseFilters;
  setCourseFilters: Action<IStore, ICourseFilters>;
  searchCourses: ThunkOn<IStore, ICourseFilters>;
  possibleCourseFilters?: IPossibleFilters;
  setPossibleCourseFilters: Action<IStore, IPossibleFilters | undefined>;
  fetchPossibleCourseFilters: Thunk<IStore>;
}

export const courseFields: IStoreCourseFields = {
  courses: undefined,
  setCourses: action((state, courses) => {
    state.courses = courses;
  }),
  courseFilters: undefined,
  setCourseFilters: action((state, filters) => {
    state.courseFilters = filters;
  }),
  searchCourses: thunkOn(
    (actions) => actions.setCourseFilters,
    async (actions, event) => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(event.payload).filter(([k, v]) => v !== undefined)
      );

      const params = new URLSearchParams({
        ...cleanedFilters,
        page: event.payload.page?.toString() ?? "0",
      });

      const resp = await api.courseSearch(params);
      const json = await resp.json();

      if (resp.ok) {
        actions.setCourses(json as ICourseDocument[]);
      } else {
        toast.error((json as ErrorResponse).error);
        actions.setCourses([]);
      }
    }
  ),
  possibleCourseFilters: undefined,
  setPossibleCourseFilters: action((state, possibleCourseFilters) => {
    state.possibleCourseFilters = possibleCourseFilters;
  }),
  fetchPossibleCourseFilters: thunk(async (actions) => {
    const resp = await api.courseFilters();
    const json = await resp.json();
    if (resp.ok) {
      actions.setPossibleCourseFilters(json);
    } else {
      toast.error("Failed to grab course filters");
      actions.setPossibleCourseFilters(undefined);
    }
  }),
};
