import debugFactory from "debug";
import Mongoose from "mongoose";

import {
  DROP_DB_ON_START,
  MONGO_CONNECTION_STRING,
  MONGO_DATABASE,
} from "../config";
import CourseInfo from "../models/course-info";
import User from "../models/user";

const debug = debugFactory("backend/database");

// Permit empty strings as valid required strings
(Mongoose.Schema.Types.String as any).checkRequired((v: any) => v != null);

export let database: Mongoose.Connection;

export const dropDatabase = async () => {
  debug("dropping database");
  await database.dropDatabase();
  debug("database dropped");
};

export const setupIndexes = async () => {
  console.log("building indexes...");
  await User.init();
  await CourseInfo.init();
  console.log("indexes built!");
};

export const connect = async (
  db: string = MONGO_DATABASE,
  drop: boolean = DROP_DB_ON_START
): Promise<Mongoose.Connection> => {
  const uri = `${MONGO_CONNECTION_STRING}/${db}`;

  console.log(`database uri: ${uri}`);

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

  database.on("error", (err) => {
    console.log(`error with the database connected at ${uri}`, err);
  });

  database.once("open", async () => {
    console.log(`connected to database via ${uri}`);
  });

  if (drop) {
    console.log("dropping");
    await dropDatabase();
    console.log("dropped");
  }

  await setupIndexes();

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
