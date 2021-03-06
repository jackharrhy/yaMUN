import mongoose, { Model, Schema, Document } from "mongoose";

import { NotFoundError } from "../api/errors";
import Course from "./course";
import { ISemester, SemesterSchema } from "./semester";
import { IUserDocument } from "./user";

export interface IScheduleDocument extends Document {
  title: string;
  description: string;
  semester: ISemester;
  courses: number[];
  owner: IUserDocument["_id"];
  public: boolean;
  addCourse: (crn: Number) => Promise<void>;
  removeCourse: (crn: Number) => Promise<void>;
}

export interface IScheduleModel extends Model<IScheduleDocument> {}

export const ScheduleSchema = new Schema<IScheduleDocument>({
  title: { type: String, required: false },
  description: { type: String, required: false },
  semester: SemesterSchema,
  courses: [Number],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  public: Boolean,
});

ScheduleSchema.methods.addCourse = async function (crn: number) {
  const course = await Course.findOneByCrn(crn);

  if (course === null) {
    throw new NotFoundError("course not found");
  } else {
    this.courses.push(crn);
    await this.save();
  }
};

ScheduleSchema.methods.removeCourse = async function (crn: number) {
  this.courses = this.courses.filter((courseCrn) => courseCrn !== crn);
  await this.save();
};

const Schedule = mongoose.model<IScheduleDocument, IScheduleModel>(
  "Schedule",
  ScheduleSchema
);

export default Schedule;
