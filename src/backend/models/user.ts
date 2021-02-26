import mongoose, { Schema } from "mongoose";

export const UserSchema = new Schema({
  username: { type: Number, required: true },
  password: { type: Number, required: true },
  email: { type: Number, required: true },
  schedules: [{
    type: Schema.Types.ObjectId,
    ref: "Schedule"
  }]
});

const User = mongoose.model("User", UserSchema);

export default User;