import debugFactory from "debug";
import mongoose, { Model, Schema, Document } from "mongoose";

import { BadRequest, NotFoundError } from "../api/errors";
import Course, { ICourseDocument } from "./course";
import {
  ISemester,
  ISemesterDocument,
  SemesterSchema,
  semestersEqual,
} from "./semester";
import { IUserDocument } from "./user";

const debug = debugFactory("backend/models/schedule");

export interface IScheduleDocument extends Document {
  title: string;
  description: string;
  semester: ISemester;
  courses: string[];
  resolvedCourses?: ICourseDocument[][];
  owner: IUserDocument["_id"];
  isPublic: boolean;
  updateMeta: (
    title: string,
    description: string,
    isPublic: boolean
  ) => Promise<void>;
  addCourse: (sid: string) => Promise<void>;
  removeCourse: (sid: string) => Promise<void>;
}

export interface IScheduleModel extends Model<IScheduleDocument> {
  semester: ISemesterDocument;
}

export const ScheduleSchema = new Schema<IScheduleDocument>(
  {
    title: { type: String, required: false },
    description: { type: String, required: false },
    semester: { type: SemesterSchema, required: true },
    courses: [String],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isPublic: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ScheduleSchema.virtual("resolvedCourses", {
  ref: "Course",
  localField: "courses",
  foreignField: "sections.sid",
  justOne: false,
});

ScheduleSchema.methods.updateMeta = async function (
  title: string,
  description: string,
  isPublic: boolean
) {
  debug("updateMeta", this.id, title, description, isPublic);
  this.title = title;
  this.description = description;
  this.isPublic = isPublic;
  await this.save();
};

ScheduleSchema.methods.addCourse = async function (sid: string) {
  debug("addCourse", this.id, sid);
  const course = await Course.findOneBySid(sid);

  if (course === null) {
    throw new NotFoundError("course not found");
  } else {
    if (semestersEqual(this.semester, course.semester)) {
      if (this.courses.includes(sid)) {
        // TODO write test for this condition
        throw new BadRequest("course already added to schedule");
      } else {
        this.courses.push(sid);
        await this.save();
      }
    } else {
      throw new BadRequest("course's semester must match that of the schedule");
    }
  }
};

ScheduleSchema.methods.removeCourse = async function (sid: string) {
  debug("removeCourse", this.id, sid);
  this.courses = this.courses.filter((courseSid) => courseSid !== sid);
  await this.save();
};

const Schedule = mongoose.model<IScheduleDocument, IScheduleModel>(
  "Schedule",
  ScheduleSchema
);

export default Schedule;
