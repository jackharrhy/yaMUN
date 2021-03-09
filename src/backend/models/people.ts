import debugFactory from "debug";
import mongoose, { Schema, Document, Model } from "mongoose";

import { BadRequest } from "../api/errors";

const debug = debugFactory("backend/models/people");

export interface IPeople {
  displayName: string;
  campus: string;
  department: string;
  title: string;
  firstName: string;
  lastName: string;
  extension: string;
  room: string;
  email: string;
}

export interface IPeopleDocument extends Document, IPeople {}

export interface IPeopleModel extends Model<IPeopleDocument> {
  findByBannerName(nameInBanner: string): Promise<IPeopleDocument[] | null>;
}

export const PeopleSchema = new Schema<IPeopleDocument>({
  displayName: { type: String, required: true },
  campus: { type: String, required: true },
  department: { type: String, required: true },
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  extension: { type: String, required: true },
  room: { type: String, required: true },
  email: { type: String, required: true },
});

PeopleSchema.statics.findByBannerName = async function (
  nameInBanner: string
): Promise<IPeopleDocument[] | null> {
  debug("findByBannerName", nameInBanner);
  const splitUp = nameInBanner.split(" ");

  if (splitUp.length !== 2) {
    throw new BadRequest(
      "expected nameInBanner to contain only two words, seperated by space"
    );
  }

  const [first, last] = splitUp;

  if (first.length !== 1) {
    throw new BadRequest(
      "expected first word in nameInBanner to have a length of 1"
    );
  }

  const firstNameRegex = new RegExp(`^${first}`);

  const query = {
    firstName: firstNameRegex,
    lastName: last,
  };

  debug("query", query);

  return await People.find(query).exec();
};

const People = mongoose.model<IPeopleDocument, IPeopleModel>(
  "People",
  PeopleSchema
);

export default People;
