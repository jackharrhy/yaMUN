import { Schema, Document } from "mongoose";

export enum DayOfWeek {
  Monday = "M",
  Tuesday = "T",
  Wednesday = "W",
  Thursday = "R",
  Friday = "F",
  Saturday = "S",
  Sunday = "U",
}

export interface ISlot {
  slot: string;
  days: string[]; // DayOfWeek[];
  beginTime: number | null;
  endTime: number | null;
  room: string | null;
}

export interface ISlotDocument extends Document, ISlot {}

export const SlotSchema = new Schema<ISlotDocument>({
  slot: { type: String, required: true },
  days: [{ type: String }],
  beginTime: { type: Number },
  endTime: { type: Number },
  room: { type: String },
});
