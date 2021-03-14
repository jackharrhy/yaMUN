import { MongoError } from "mongodb";
import mongoose, { Schema, Document, Model } from "mongoose";

import { checkPassword, hashPassword } from "../api/auth";
import { BadRequest } from "../api/errors";
import Bookmark from "./bookmark";

const MAX_USERNAME_LENGTH = 20;
const MAX_PASSWORD_LENGTH = 64;

export interface IUserDocument extends Document {
  username: string;
  passwordHash: string;
}

export interface IUserModel extends Model<IUserDocument> {
  createUser(username: string, password: string): Promise<IUserDocument>;
  login(username: string, password: string): Promise<string | null>;
}

export const UserSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

UserSchema.statics.createUser = async function (
  username: string,
  password: string
): Promise<IUserDocument> {
  if (username.length > MAX_USERNAME_LENGTH) {
    throw new BadRequest(`username can't be greater than ${MAX_USERNAME_LENGTH}`);
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new BadRequest(`password can't be greater than ${MAX_PASSWORD_LENGTH}`);
  }

  const passwordHash = await hashPassword(password);

  let user: IUserDocument;

  try {
    user = await User.create({ username, passwordHash });
  } catch (err) {
    // 11000 is duplicate entry, to avoid multiple users with the same username
    if (err instanceof MongoError && err.code == 11000) {
      throw new BadRequest("username already exists");
    }
    throw err;
  }

  await Bookmark.findOrCreateByUserId(user.id);

  return user;
};

UserSchema.statics.login = async function (
  username: string,
  password: string
): Promise<string | null> {
  const user: IUserDocument | null = await User.findOne({ username }).exec();

  if (user !== null && (await checkPassword(password, user.passwordHash))) {
    return user.id;
  } else {
    return null;
  }
};

const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);

export default User;
