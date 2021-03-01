import debugFactory from "debug";
import Mongoose from "mongoose";

const debug = debugFactory("backend/database");

export let database: Mongoose.Connection;

export const dropDatabase = () => {
  debug("dropping database");
  database.dropDatabase();
  debug("database dropped");
};

export const connect = (
  username: string,
  password: string,
  endpoint: string
) => {
  const uri = `mongodb://${username}:${password}@${endpoint}`;

  if (database) {
    throw new Error(
      "attempted to connect while there was already an existing databsae connection"
    );
  }

  Mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  database = Mongoose.connection;

  dropDatabase(); // TODO remove this after we wish to keep the database

  database.once("open", async () => {
    console.log(`connected to database at ${endpoint}`);
  });
  database.on("error", (err) => {
    console.log("error connecting to database", err);
  });

  return database;
};

export const disconnect = () => {
  if (!database) {
    throw new Error(
      "attempted to disconnect while there was not an existing databsae connection"
    );
  }
  Mongoose.disconnect();
};
