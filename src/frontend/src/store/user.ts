import { action, Action, thunk, Thunk, Computed, computed } from "easy-peasy";
import { toast } from "react-hot-toast";

import { IStore } from ".";
import { api } from "../api";

export interface IStoreUserFields {
  id?: string;
  username?: string;
  loggedIn: Computed<IStore, boolean>;
  setUser: Action<IStore, { id?: string; username?: string }>;
  fetchLoginStatus: Thunk<IStore>;
  login: Thunk<IStore, { username: string; password: string }>;
  logout: Thunk<IStore>;
  createAccount: Thunk<IStore, { username: string; password: string }>;
}

export const userFields: IStoreUserFields = {
  id: undefined,
  username: undefined,
  loggedIn: computed((state) => state.username !== undefined),
  setUser: action((state, { id, username }) => {
    state.id = id;
    state.username = username;
  }),
  fetchLoginStatus: thunk(async (actions) => {
    const resp = await api.loginStatus();
    const json = await resp.json();
    if (resp.ok) {
      actions.setUser(json);
    } else {
      actions.setUser({ id: undefined, username: undefined });
    }
  }),
  login: thunk(async (actions, { username, password }) => {
    const resp = await api.login(username, password);
    if (resp.ok) {
      await actions.fetchLoginStatus();
    } else {
      const json = await resp.json();
      toast.error(json.error);
    }
  }),
  logout: thunk(async (actions) => {
    await api.logout();
    await actions.fetchLoginStatus();
  }),
  createAccount: thunk(async (actions, { username, password }) => {
    const resp = await api.createAccount(username, password);
    if (resp.ok) {
      await actions.fetchLoginStatus();
    } else {
      const json = await resp.json();
      toast.error(json.error);
    }
  }),
};
