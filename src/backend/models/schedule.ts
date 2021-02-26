import mongoose, { Schema, Document } from "mongoose";

import { ISemester, SemesterSchema } from "./semester"; 

export interface ISchedule {
  title: string;
  description: string;
  semester: ISemester;
  courses: Number[];
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}

export interface IScheduleDocument extends Document, ISchedule {

}

export const ScheduleSchema = new Schema({
  title: { type: String, required: false },
  description: { type: String, required: false },
  semester: SemesterSchema,
  courses: [Number],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Schedule = mongoose.model<IScheduleDocument>("Schedule", ScheduleSchema);

export default Schedule;
