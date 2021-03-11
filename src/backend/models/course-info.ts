import debugFactory from "debug";
import mongoose, { Schema, Document, Model } from "mongoose";

const debug = debugFactory("backend/models/course-info");

export interface ICourseInfo {
  subject: string;
  number: string;
  title: string;
  description: string;
  attributes: string[];
}

export interface ICourseInfoDocument extends Document, ICourseInfo {}

export interface ICourseInfoModel extends Model<ICourseInfoDocument> {}

export const CourseInfoSchema = new Schema<ICourseInfoDocument>({
  subject: { type: String, required: true },
  number: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  attributes: { type: [String], required: true },
});

CourseInfoSchema.index({ subject: 1, number: 1 }, { unique: true });

const CourseInfo = mongoose.model<ICourseInfoDocument, ICourseInfoModel>(
  "CourseInfo",
  CourseInfoSchema
);

export default CourseInfo;
