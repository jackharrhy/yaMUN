import { createStore, createTypedHooks } from "easy-peasy";

import { bookmarkFields, IStoreBookmarkFields } from "./bookmarks";
import { courseFields, IStoreCourseFields } from "./courses";
import { IStoreUserFields, userFields } from "./user";

export interface IStore
  extends IStoreUserFields,
    IStoreCourseFields,
    IStoreBookmarkFields {}

const storeModel = {
  ...userFields,
  ...courseFields,
  ...bookmarkFields,
};

export const store = createStore<IStore>(storeModel);

const typedHooks = createTypedHooks<IStore>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
