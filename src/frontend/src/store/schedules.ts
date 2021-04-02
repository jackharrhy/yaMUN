import { thunk, Thunk, action, Action } from "easy-peasy";
import { toast } from "react-hot-toast";

import { IStore } from ".";
import { ICreateScheduleInput } from "../../../backend/api/controllers/schedules";
import { IScheduleDocument } from "../../../backend/models/schedule";
import { api, ErrorResponse } from "../api";

export interface IStoreScheduleFields {
  usersSchedules?: IScheduleDocument[];
  setUsersSchedules: Action<IStore, IScheduleDocument[] | undefined>;
  fetchSchedules: Thunk<IStore>;
  currentSchedule?: IScheduleDocument;
  setCurrentSchedule: Action<IStore, IScheduleDocument | undefined>;
  fetchNewCurrentSchedule: Thunk<IStore, { scheduleId: string }>;
  createSchedule: Thunk<IStore, ICreateScheduleInput>;
  addCourseToSchedule: Thunk<IStore, { scheduleId: string; sid: string }>;
}

export const scheduleFields: IStoreScheduleFields = {
  usersSchedules: undefined,
  setUsersSchedules: action((state, usersSchedules) => {
    state.usersSchedules = usersSchedules;
  }),
  fetchSchedules: thunk(async (actions) => {
    const resp = await api.schedules();
    const json = await resp.json();

    if (resp.ok) {
      actions.setUsersSchedules(json);
    } else {
      actions.setUsersSchedules(undefined);
    }
  }),
  currentSchedule: undefined,
  setCurrentSchedule: action((state, currentSchedule) => {
    state.currentSchedule = currentSchedule;
  }),
  fetchNewCurrentSchedule: thunk(async (actions, { scheduleId }) => {
    const resp = await api.schedule(scheduleId);
    const json = await resp.json();

    if (resp.ok) {
      actions.setCurrentSchedule(json as IScheduleDocument);
    } else {
      toast.error((json as ErrorResponse).error);
      actions.setCurrentSchedule(undefined);
    }
  }),
  createSchedule: thunk(
    async (actions, { title, description, isPublic, semester }) => {
      const resp = await api.createSchedule(
        title,
        description,
        isPublic,
        semester
      );

      if (resp.ok) {
        toast.success("Created new schedule");
        // TODO fetch current schedule again
      } else {
        const json = (await resp.json()) as ErrorResponse;
        toast.error(json.error);
      }
    }
  ),
  addCourseToSchedule: thunk(async (actions, { scheduleId, sid }) => {
    const resp = await api.addCourseToSchedule(scheduleId, sid);

    if (resp.ok) {
      toast.success(`Added '${sid}' to current schedule`);
      actions.fetchNewCurrentSchedule({ scheduleId });
    } else {
      const json = (await resp.json()) as ErrorResponse;
      toast.error(json.error);
    }
  }),
};
