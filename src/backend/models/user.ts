import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserDocument extends Document {
  username: string;
  password: string;
  email: string;
}

export interface IUserModel extends Model<IUserDocument> {}

export const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);

export default User;
