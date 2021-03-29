import { thunk, Thunk, action, Action } from "easy-peasy";
import { toast } from "react-hot-toast";

import { IStore } from ".";
import { IBookmarkDocument } from "../../../backend/models/bookmark";
import { api } from "../api";

export interface IStoreBookmarkFields {
  bookmarks?: IBookmarkDocument;
  setBookmarks: Action<IStore, IBookmarkDocument | undefined>;
  fetchBookmarks: Thunk<IStore>;
  addBookmark: Thunk<IStore, string>;
  removeBookmark: Thunk<IStore, string>;
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
      actions.setBookmarks(json);
    } else {
      actions.setBookmarks(undefined);
    }
  }),
  addBookmark: thunk(async (actions, sid) => {
    const resp = await api.addBookmark(sid);

    if (resp.ok) {
      toast.success(`Added '${sid}' to bookmarks`);
      actions.fetchBookmarks();
    } else {
      const json = await resp.json();
      toast.error(json.error);
    }
  }),
  removeBookmark: thunk(async (actions, sid) => {
    const resp = await api.removeBookmark(sid);

    if (resp.ok) {
      toast.success(`Removed '${sid}' from bookmarks`);
      actions.fetchBookmarks();
    } else {
      const json = await resp.json();
      toast.error(json.error);
    }
  }),
};
