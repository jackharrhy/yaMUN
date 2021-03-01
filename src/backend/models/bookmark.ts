import mongoose, { Schema, Document, Model } from "mongoose";
import { NotFoundError } from "../api/errors";
import Course from "./course";
import { IUserDocument } from "./user";
import debugFactory from "debug";

const debug = debugFactory("backend/models/bookmark");

export interface IBookmarkDocument extends Document {
  owner: IUserDocument["_id"];
  courses: number[];
  addCourse: (crn: Number) => Promise<void>;
  removeCourse: (crn: Number) => Promise<void>;
}

export interface IBookmarkModel extends Model<IBookmarkDocument> {
  findByUserId: (userId: String) => Promise<IBookmarkDocument | null>;
  findOrCreateByUserId: (userId: String) => Promise<IBookmarkDocument>;
}

export const BookmarkSchema = new Schema<IBookmarkDocument>({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courses: [Number],
});

BookmarkSchema.statics.findByUserId = async function (userId: string) {
  debug("findByUserId", userId);
  return await this.findOne({ owner: userId }).exec();
};

BookmarkSchema.statics.findOrCreateByUserId = async function (userId: string) {
  debug("findOrCreateByUserId", userId);
  const existingDocument: IBookmarkDocument | null = await this.findOne({
    owner: userId,
  }).exec();
  if (existingDocument === null) {
    return await this.create({ owner: userId, courses: [] });
  } else {
    return existingDocument;
  }
};

BookmarkSchema.methods.addCourse = async function (crn: number) {
  debug("addCourse", crn);
  const course = await Course.findOneByCrn(crn);
  if (course === null) {
    throw new NotFoundError("course not found");
  } else {
    const alreadyAdded = this.courses.find((courseCrn) => courseCrn === crn);
    if (!alreadyAdded) {
      this.courses.push(crn);
    }
    await this.save();
  }
};

BookmarkSchema.methods.removeCourse = async function (crn: number) {
  debug("removeCourse", crn);
  const course = await Course.findOneByCrn(crn);
  if (course === null) {
    throw new NotFoundError("course not found");
  } else {
    this.courses = this.courses.filter((courseCrn) => courseCrn !== crn);
    await this.save();
  }
};

const Bookmark = mongoose.model<IBookmarkDocument, IBookmarkModel>(
  "Bookmark",
  BookmarkSchema
);

export default Bookmark;
