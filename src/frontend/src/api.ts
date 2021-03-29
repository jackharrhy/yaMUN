import { IPossibleFilters } from "../../backend/api/controllers/courses";
import { IUserSelfInfo } from "../../backend/api/controllers/users";
import { IBookmarkDocument } from "../../backend/models/bookmark";
import { ICourseDocument } from "../../backend/models/course";

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
    return await post(`${API_BASE}/login`, { username, password });
  },
  logout: async (): Promise<Response> => {
    return await fetch(`${API_BASE}/logout`);
  },
  createAccount: async (
    username: string,
    password: string
  ): Promise<Response> => {
    return await post(`${API_BASE}/users`, { username, password });
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
  courseFilters: async (): Promise<TypedResponse<IPossibleFilters>> => {
    return await fetch(`${API_BASE}/course-filters`);
  },
  courseSearch: async (
    params: URLSearchParams
  ): Promise<TypedResponse<ICourseDocument[] | ErrorResponse>> => {
    return await fetch(`${API_BASE}/courses/?${params}`);
  },
};
