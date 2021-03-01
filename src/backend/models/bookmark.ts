import mongoose, { Schema, Document, Model } from "mongoose";
import { NotFoundError } from "../api/errors";
import Course from "./course";
import { IUser } from "./user";
import debugFactory from "debug";


const debug = debugFactory("backend/models/bookmark");


export interface IBookmark {
  owner: IUser["_id"];
  courses: number[];
}

export interface IBookmarkDocument extends Document, IBookmark {
  addCourse: (crn: Number) => Promise<boolean>;
  removeCourse: (crn: Number) => Promise<boolean>;
}

export interface IBookmarkModel extends Model<IBookmarkDocument> {
  findByUserId: (userId: String) => Promise<IBookmarkDocument>;
  findOrCreateByUserId: (userId: String) => Promise<IBookmarkDocument>;
}

export const BookmarkSchema = new Schema<IBookmarkDocument>({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courses: [Number],
});

BookmarkSchema.statics.findByUserId = async function (userId: string) {
  return await this.create({"owner": userId})
}

BookmarkSchema.statics.findOrCreateByUserId = async function (userId: string) {
  debug("findByUserId", userId);
  const existing = await this.findOne({"owner": userId}).exec();
  if(existing) {
    return existing;
  } else {
    const created = await this.create({"owner": userId, courses: []});
    return created;
  }
}

BookmarkSchema.methods.addCourse = async function (crn: number) {
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
      throw new Error("unable to save bookmarks");
    }
  } else {
    throw new NotFoundError("bookmarks not found");
  }
};

BookmarkSchema.methods.removeCourse = async function (crn: number) {
  const course = await Course.findOneByCrn(crn);
  if (course) {
    if (Array.isArray(this.courses)) {
      this.courses = this.courses.filter((courseCrn) => courseCrn !== crn);
      const saved = await this.save();
      if (saved === this) {
        return;
      } else {
        throw new Error("unable to save bookmarks");
      }
    }
  } else {
    throw new NotFoundError("bookmarks not found");
  }
};

const Bookmark = mongoose.model<IBookmarkDocument, IBookmarkModel>("Bookmark", BookmarkSchema);

export default Bookmark;
