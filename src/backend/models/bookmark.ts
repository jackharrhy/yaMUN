import debugFactory from "debug";
import mongoose, { Schema, Document, Model, Types } from "mongoose";

import { BadRequest, NotFoundError } from "../api/errors";
import { MAX_BOOKMARKS } from "../consts";
import Course from "./course";
import { IUserDocument } from "./user";

const debug = debugFactory("backend/models/bookmark");

export interface IBookmarkDocument extends Document {
  owner: IUserDocument["_id"];
  courses: string[];
  addCourse: (sid: string) => Promise<void>;
  removeCourse: (sid: string) => Promise<void>;
}

export interface IBookmarkModel extends Model<IBookmarkDocument> {
  findByUserId: (userId: Types.ObjectId) => Promise<IBookmarkDocument | null>;
  findOrCreateByUserId: (userId: Types.ObjectId) => Promise<IBookmarkDocument>;
}

export const BookmarkSchema = new Schema<IBookmarkDocument>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courses: [String],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

BookmarkSchema.virtual("resolvedCourses", {
  ref: "Course",
  localField: "courses",
  foreignField: "sections.sid",
  justOne: false,
});

BookmarkSchema.statics.findByUserId = async function (userId: Types.ObjectId) {
  debug("findByUserId", userId);
  return await this.findOne({ owner: userId })
    .populate("resolvedCourses")
    .exec();
};

BookmarkSchema.statics.findOrCreateByUserId = async function (
  userId: Types.ObjectId
) {
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

BookmarkSchema.methods.addCourse = async function (sid: string) {
  debug("addCourse", sid);

  if (this.courses.length > MAX_BOOKMARKS) {
    throw new Error(`you can't have more than ${MAX_BOOKMARKS} bookmarks`);
  }

  const course = await Course.findOneBySid(sid);
  if (course === null) {
    throw new NotFoundError("course not found");
  } else {
    const alreadyAdded = this.courses.find((courseSid) => courseSid === sid);
    if (alreadyAdded) {
      throw new BadRequest("course already added to bookmarks");
    } else {
      this.courses.push(sid);
      await this.save();
    }
  }
};

BookmarkSchema.methods.removeCourse = async function (sid: string) {
  debug("removeCourse", sid);
  this.courses = this.courses.filter((courseSid) => courseSid !== sid);
  await this.save();
};

const Bookmark = mongoose.model<IBookmarkDocument, IBookmarkModel>(
  "Bookmark",
  BookmarkSchema
);

export default Bookmark;
