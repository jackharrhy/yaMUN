import debugFactory from "debug";
import mongoose, { Model, Schema, Document } from "mongoose";

import { BadRequest, NotFoundError } from "../api/errors";
import Course from "./course";
import { ISemester, SemesterSchema, semestersEqual } from "./semester";
import { IUserDocument } from "./user";

const debug = debugFactory("backend/models/schedule");

export interface IScheduleDocument extends Document {
  title: string;
  description: string;
  semester: ISemester;
  courses: number[];
  owner: IUserDocument["_id"];
  public: boolean;
  updateMeta: (
    title: string,
    description: string,
    isPublic: boolean
  ) => Promise<void>;
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

ScheduleSchema.methods.updateMeta = async function (
  title: string,
  description: string,
  isPublic: boolean
) {
  debug("updateMeta", this.id, title, description, isPublic);
  this.title = title;
  this.description = description;
  this.public = isPublic;
  await this.save();
};

ScheduleSchema.methods.addCourse = async function (crn: number) {
  debug("addCourse", this.id, crn);
  const course = await Course.findOneByCrn(crn);

  if (course === null) {
    throw new NotFoundError("course not found");
  } else {
    if (semestersEqual(this.semester, course.semester)) {
      this.courses.push(crn);
      await this.save();
    } else {
      throw new BadRequest("course's semester must match that of the schedule");
    }
  }
};

ScheduleSchema.methods.removeCourse = async function (crn: number) {
  debug("removeCourse", this.id, crn);
  this.courses = this.courses.filter((courseCrn) => courseCrn !== crn);
  await this.save();
};

const Schedule = mongoose.model<IScheduleDocument, IScheduleModel>(
  "Schedule",
  ScheduleSchema
);

export default Schedule;
