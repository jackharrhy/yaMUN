import { Schema } from "mongoose";

export interface ISubject {
  name: string;
}

export const SubjectSchema = new Schema({
  name: { type: String, required: true },
});
