import { createStore, createTypedHooks } from "easy-peasy";

import { bookmarkFields, IStoreBookmarkFields } from "./bookmarks";
import { courseFields, IStoreCourseFields } from "./courses";
import { IStoreScheduleFields, scheduleFields } from "./schedules";
import { IStoreUserFields, userFields } from "./user";

export interface IStore
  extends IStoreUserFields,
    IStoreCourseFields,
    IStoreBookmarkFields,
    IStoreScheduleFields {}

const storeModel = {
  ...userFields,
  ...courseFields,
  ...bookmarkFields,
  ...scheduleFields,
};

export const store = createStore<IStore>(storeModel);

const typedHooks = createTypedHooks<IStore>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
