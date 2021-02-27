import mongoose, { Schema, Document } from "mongoose";

import { ISemester, SemesterSchema } from "./semester";
import { IUser } from "./user";

export interface ISchedule extends Document {
  title: string;
  description: string;
  semester: ISemester;
  courses: number[];
  owner: IUser["_id"];
}

export const ScheduleSchema = new Schema({
  title: { type: String, required: false },
  description: { type: String, required: false },
  semester: SemesterSchema,
  courses: [Number],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Schedule = mongoose.model<ISchedule>("Schedule", ScheduleSchema);

export default Schedule;
