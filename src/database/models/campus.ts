import { Schema } from "mongoose";
export interface ICampus {
  name: string;
}

export const CampusSchema = new Schema({
  name: { type: String, required: true },
});
