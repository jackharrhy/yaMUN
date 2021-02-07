import mongoose, { Schema, Document } from "mongoose";

export interface ICampus {
  name: string;
}

export interface ICampusDocument extends Document, ICampus {}

export const CampusSchema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.model<ICampusDocument>("Campus", CampusSchema);
