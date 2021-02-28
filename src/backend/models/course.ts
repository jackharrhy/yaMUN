import debugFactory from "debug";
import mongoose, { Schema, Document, Model } from "mongoose";

import { ISection, SectionSchema } from "./section";
import { INullableSemester, ISemester, SemesterSchema } from "./semester";

const debug = debugFactory("backend/models/course");

export interface ICourse {
  semester: ISemester;
  campus: string;
  session: string;
  subject: string;
  number: string;
  name: string;
  sections: ISection[];
}

export interface ICourseDocument extends Document, ICourse {}

export interface ICourseModel extends Model<ICourseDocument> {
  findOneByCrn(crn: Number): Promise<ICourse>;
}

export interface ICourseModelSearch {
  page: number;
  limit: number;
  include?: string[];
  semesterYear?: number;
  semesterTerm?: number;
  semesterLevel?: number;
  subject?: string;
  number?: string;
  name?: string;
}

export interface ICourseModelSearchQuery {
  semester?: INullableSemester;
  subject?: string;
  number?: string;
  name?: string;
}

export interface ICourseModel extends Model<ICourseDocument> {
  search(args: ICourseModelSearch): Promise<ICourse[]>;
}

export const CourseSchema = new Schema({
  semester: SemesterSchema,
  campus: { type: String, required: true },
  session: { type: String, required: true },
  subject: { type: String, required: true },
  number: { type: String, required: true },
  name: { type: String, required: true },
  sections: [SectionSchema],
});

CourseSchema.statics.findOneByCrn = async function (crn: Number) : Promise<ICourse> {
  return await this.findOne({
    sections: { $elemMatch: { crn } },
  }).exec();
}

CourseSchema.statics.search = async function (
  args: ICourseModelSearch
): Promise<ICourse[]> {
  debug("args", args);

  const { subject, number, name } = args;

  const query: ICourseModelSearchQuery = Object.fromEntries(
    Object.entries({
      subject,
      number,
      name,
    }).filter(([k, v]) => v !== undefined)
  );

  if (args.semesterLevel || args.semesterTerm || args.semesterYear) {
    query.semester = Object.fromEntries(
      Object.entries({
        year: args.semesterYear,
        term: args.semesterTerm,
        level: args.semesterLevel,
      }).filter(([k, v]) => v !== undefined)
    );
  }

  debug("query", query);
  return this.find(query)
    .skip(args.page * args.limit)
    .limit(args.limit)
    .exec();
};

const Course = mongoose.model<ICourseDocument, ICourseModel>(
  "Course",
  CourseSchema
);

export default Course;
