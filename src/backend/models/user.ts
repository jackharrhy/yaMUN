import mongoose, { Schema, Document } from "mongoose";
import { ISchedule } from "./schedule";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  schedules: [ISchedule["_id"]];
}

export const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  schedules: [
    {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
    },
  ],
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
