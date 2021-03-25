import { thunk, Thunk, action, Action } from "easy-peasy";
import { toast } from "react-hot-toast";

import { IStore } from ".";
import { api } from "../api";

export interface IStoreBookmarkFields {
  bookmarks?: number[];
  setBookmarks: Action<IStore, number[] | undefined>;
  fetchBookmarks: Thunk<IStore>;
  addBookmark: Thunk<IStore, number>;
  removeBookmark: Thunk<IStore, number>;
}

export const bookmarkFields: IStoreBookmarkFields = {
  bookmarks: undefined,
  setBookmarks: action((state, bookmarks) => {
    state.bookmarks = bookmarks;
  }),
  fetchBookmarks: thunk(async (actions) => {
    const resp = await api.bookmarks();
    const json = await resp.json();

    if (resp.ok) {
      actions.setBookmarks(json.courses);
    } else {
      actions.setBookmarks(undefined);
    }
  }),
  addBookmark: thunk(async (actions, crn) => {
    const resp = await api.addBookmark(crn);

    if (resp.ok) {
      toast.success(`Added '${crn}' to bookmarks`);
      actions.fetchBookmarks();
    } else {
      const json = await resp.json();
      toast.error(json.error);
    }
  }),
  removeBookmark: thunk(async (actions, crn) => {
    const resp = await api.removeBookmark(crn);

    if (resp.ok) {
      toast.success(`Removed '${crn}' from bookmarks`);
      actions.fetchBookmarks();
    } else {
      const json = await resp.json();
      toast.error(json.error);
    }
  }),
};
