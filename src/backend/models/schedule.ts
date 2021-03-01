import mongoose, { Model, Schema, Document } from "mongoose";
import { NotFoundError } from "../api/errors";
import Course from "./course";
import { ISemester, SemesterSchema } from "./semester";
import { IUser } from "./user";

export interface ISchedule extends Document {
  title: string;
  description: string;
  semester: ISemester;
  courses: number[];
  owner: IUser["_id"];
}

export interface IScheduleModel extends Model<ISchedule> {
  addCourse: (crn: Number) => Promise<boolean>;
}

export const ScheduleSchema = new Schema<ISchedule>({
  title: { type: String, required: false },
  description: { type: String, required: false },
  semester: SemesterSchema,
  courses: [Number],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

ScheduleSchema.methods.addCourse = async function (crn: number) {
  const course = await Course.findOneByCrn(crn);
  if (course) {
    if (this.courses) {
      this.courses.push(crn);
    } else {
      this.courses = [crn];
    }
    const saved = await this.save();
    if (saved === this) {
      return;
    } else {
      throw new Error("unable to save schedule");
    }
  } else {
    throw new NotFoundError("course not found");
  }
};

ScheduleSchema.methods.removeCourse = async function (crn: number) {
  const course = await Course.findOneByCrn(crn);
  if (course) {
    if (Array.isArray(this.courses)) {
      this.courses = this.courses.filter((courseCrn) => courseCrn !== crn);
      const saved = await this.save();
      if (saved === this) {
        return;
      } else {
        throw new Error("unable to save schedule");
      }
    }
  } else {
    throw new NotFoundError("course not found");
  }
};

const Schedule = mongoose.model<ISchedule>("Schedule", ScheduleSchema);

export default Schedule;
