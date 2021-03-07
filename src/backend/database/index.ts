import debugFactory from "debug";
import Mongoose from "mongoose";

import { DROP_DB_ON_START, MONGO_CONNECTION_STRING } from "../config";
import User from "../models/user";

const debug = debugFactory("backend/database");

export let database: Mongoose.Connection;

export const dropDatabase = async () => {
  debug("dropping database");
  await database.dropDatabase();
  debug("database dropped");
};

export const connect = async () => {
  const uri = MONGO_CONNECTION_STRING;

  if (database) {
    throw new Error(
      "attempted to connect while there was already an existing databsae connection"
    );
  }

  await Mongoose.connect(uri, {
    autoIndex: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  database = Mongoose.connection;

  if (DROP_DB_ON_START) {
    await dropDatabase();
  }

  database.once("open", async () => {
    console.log(`connected to database via ${uri}`);
  });
  database.on("error", (err) => {
    console.log(`error connecting to database via ${uri}`, err);
  });

  console.log("building indexes...");
  await User.init();
  console.log("indexes built!");

  return database;
};

export const disconnect = async () => {
  if (!database) {
    throw new Error(
      "attempted to disconnect while there was not an existing databsae connection"
    );
  }
  await Mongoose.disconnect();
};
