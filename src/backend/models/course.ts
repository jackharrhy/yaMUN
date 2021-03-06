import debugFactory from "debug";
import mongoose, { Schema, Document, Model } from "mongoose";

import { ISection, SectionSchema } from "./section";
import { ISemester, SemesterSchema } from "./semester";

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
  prof?: string;
  days?: string[];
  beginTimeMin?: number;
  beginTimeMax?: number;
  endTimeMin?: number;
  endTimeMax?: number;
}

export interface ICourseModelSearchQuery {
  semester?: Partial<ISemester>,
  subject?: string;
  number?: string;
  name?: string;
  sections?: {
    $elemMatch: {
      $or?: [{ primaryInstructor?: string }, { secondaryInstructor?: string }];
      slots?: {
        $elemMatch: {
          beginTime?: {
            $gte?: number;
            $lte?: number;
          };
          endTime?: {
            $gte?: number;
            $lte?: number;
          };
          days?: {
            $in: string[];
          };
        };
      };
    };
  };
}

export interface ICourseModel extends Model<ICourseDocument> {
  findOneByCrn(crn: number): Promise<ICourse | null>;
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

CourseSchema.statics.findOneByCrn = async function (
  crn: number
): Promise<ICourse> {
  debug("findOneByCrn", crn);
  return await this.findOne({
    sections: { $elemMatch: { crn } },
  }).exec();
};

CourseSchema.statics.search = async function (
  args: ICourseModelSearch
): Promise<ICourse[]> {
  debug("search", args);
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

  const hasBeginEndFields =
    args.beginTimeMin ||
    args.beginTimeMax ||
    args.endTimeMin ||
    args.endTimeMax;

  if (args.prof || args.days || hasBeginEndFields) {
    query.sections = { $elemMatch: {} };

    if (args.prof !== undefined) {
      query.sections.$elemMatch = {
        ...query.sections.$elemMatch,
        $or: [
          { primaryInstructor: args.prof },
          { secondaryInstructor: args.prof },
        ],
      };
    }

    if (args.days || hasBeginEndFields) {
      query.sections.$elemMatch.slots = { $elemMatch: {} };

      if (args.days !== undefined) {
        query.sections.$elemMatch.slots.$elemMatch = {
          ...query.sections.$elemMatch.slots.$elemMatch,
          days: { $in: args.days },
        };
      }

      if (hasBeginEndFields) {
        query.sections.$elemMatch.slots.$elemMatch = {
          ...query.sections.$elemMatch.slots.$elemMatch,
        };

        if (args.beginTimeMin || args.beginTimeMax) {
          query.sections.$elemMatch.slots.$elemMatch.beginTime = {
            ...query.sections.$elemMatch.slots.$elemMatch.beginTime,
          };

          if (args.beginTimeMin !== undefined) {
            query.sections.$elemMatch.slots.$elemMatch.beginTime.$gte =
              args.beginTimeMin;
          }

          if (args.beginTimeMax !== undefined) {
            query.sections.$elemMatch.slots.$elemMatch.beginTime.$lte =
              args.beginTimeMax;
          }
        }

        if (args.endTimeMin || args.endTimeMax) {
          query.sections.$elemMatch.slots.$elemMatch.endTime = {
            ...query.sections.$elemMatch.slots.$elemMatch.endTime,
          };

          if (args.beginTimeMin !== undefined) {
            query.sections.$elemMatch.slots.$elemMatch.endTime.$gte =
              args.endTimeMin;
          }

          if (args.beginTimeMax !== undefined) {
            query.sections.$elemMatch.slots.$elemMatch.endTime.$lte =
              args.endTimeMax;
          }
        }
      }
    }
  }

  debug("query", JSON.stringify(query, null, 2));
  return await this.find(query)
    .skip(args.page * args.limit)
    .limit(args.limit)
    .exec();
};

const Course = mongoose.model<ICourseDocument, ICourseModel>(
  "Course",
  CourseSchema
);

export default Course;
