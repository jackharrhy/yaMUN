import { IPossibleFilters } from "../../backend/api/controllers/courses";
import { ICreateScheduleInput } from "../../backend/api/controllers/schedules";
import {
  ICreateUserInput,
  IUserSelfInfo,
} from "../../backend/api/controllers/users";
import { IBookmarkDocument } from "../../backend/models/bookmark";
import { ICourseDocument } from "../../backend/models/course";
import { IPeopleDocument } from "../../backend/models/people";
import { IScheduleDocument } from "../../backend/models/schedule";
import { ISemester } from "../../backend/models/semester";

const API_BASE = "/api";

async function post(url: string, data: object) {
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function put(url: string) {
  return await fetch(url, { method: "PUT" });
}

async function del(url: string) {
  return await fetch(url, { method: "DELETE" });
}

export interface ErrorResponse {
  error: string;
}

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

export const api = {
  loginStatus: async (): Promise<TypedResponse<IUserSelfInfo>> => {
    return await fetch(`${API_BASE}/users`);
  },
  login: async (username: string, password: string): Promise<Response> => {
    return await post(`${API_BASE}/login`, {
      username,
      password,
    } as ICreateUserInput);
  },
  logout: async (): Promise<Response> => {
    return await fetch(`${API_BASE}/logout`);
  },
  createAccount: async (
    username: string,
    password: string
  ): Promise<Response> => {
    const data: ICreateUserInput = { username, password };
    return await post(`${API_BASE}/users`, data);
  },
  bookmarks: async (): Promise<TypedResponse<IBookmarkDocument>> => {
    return await fetch(`${API_BASE}/bookmarks`);
  },
  addBookmark: async (sid: string): Promise<Response> => {
    return await put(`${API_BASE}/bookmarks/courses/${sid}`);
  },
  removeBookmark: async (sid: string): Promise<Response> => {
    return await del(`${API_BASE}/bookmarks/courses/${sid}`);
  },
  schedules: async (): Promise<TypedResponse<IScheduleDocument[]>> => {
    return await fetch(`${API_BASE}/schedules`);
  },
  schedule: async (
    scheduleId: string
  ): Promise<TypedResponse<IScheduleDocument | ErrorResponse>> => {
    return await fetch(`${API_BASE}/schedules/${scheduleId}`);
  },
  createSchedule: async (
    title: string,
    description: string,
    isPublic: boolean,
    semester: ISemester
  ): Promise<TypedResponse<IScheduleDocument | ErrorResponse>> => {
    const data: ICreateScheduleInput = {
      title,
      description,
      isPublic,
      semester,
    };

    return await post(`${API_BASE}/schedules/`, data);
  },
  removeSchedule: async (scheduleId: string): Promise<Response> => {
    return await del(`${API_BASE}/schedules/${scheduleId}`);
  },
  addCourseToSchedule: async (
    scheduleId: string,
    sid: string
  ): Promise<Response> => {
    return await put(`${API_BASE}/schedules/${scheduleId}/${sid}`);
  },
  removeCourseFromSchedule: async (
    scheduleId: string,
    sid: string
  ): Promise<Response> => {
    return await del(`${API_BASE}/schedules/${scheduleId}/${sid}`);
  },
  courseFilters: async (): Promise<TypedResponse<IPossibleFilters>> => {
    return await fetch(`${API_BASE}/course-filters`);
  },
  courseSearch: async (
    params: URLSearchParams
  ): Promise<TypedResponse<ICourseDocument[] | ErrorResponse>> => {
    return await fetch(`${API_BASE}/courses/?${params}`);
  },
  peopleSearch: async (
    params: URLSearchParams
  ): Promise<TypedResponse<IPeopleDocument[] | ErrorResponse>> => {
    return await fetch(`${API_BASE}/people/?${params}`);
  },
};
