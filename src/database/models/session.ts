import { Schema } from "mongoose";

export interface ISession {
  name: string;
}

export const SessionSchema = new Schema({
  name: { type: String, required: true },
});
