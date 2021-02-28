import { Schema } from "mongoose";

export enum DayOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export interface ISlot {
  slot: string;
  days: string[]; // DayOfWeek[];
  beginTime: number | null;
  endTime: number | null;
  room: string | null;
}

export const SlotSchema = new Schema({
  slot: { type: String, required: true },
  days: [{ type: String }],
  beginTime: { type: Number },
  endTime: { type: Number },
  room: { type: String },
});
