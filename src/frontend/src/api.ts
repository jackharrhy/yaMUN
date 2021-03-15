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

export const api = {
  loginStatus: async (): Promise<Response> => {
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
  bookmarks: async (): Promise<Response> => {
    return await fetch(`${API_BASE}/bookmarks/courses`);
  },
  addBookmark: async (crn: number): Promise<Response> => {
    return await put(`${API_BASE}/bookmarks/courses/${crn}`);
  },
  removeBookmark: async (crn: number): Promise<Response> => {
    return await del(`${API_BASE}/bookmarks/courses/${crn}`);
  },
  courseFilters: async (): Promise<Response> => {
    return await fetch(`${API_BASE}/course-filters`);
  },
  courseSearch: async (params: URLSearchParams): Promise<Response> => {
    return await fetch(`${API_BASE}/courses/?${params}`);
  },
};
