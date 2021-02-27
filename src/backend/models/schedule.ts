import mongoose, { Model, Schema, Document } from "mongoose";
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
      return true;
    }
    return false;
  }
  return false;
};

const Schedule = mongoose.model<ISchedule>("Schedule", ScheduleSchema);

export default Schedule;
