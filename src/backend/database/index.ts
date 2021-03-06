import debugFactory from "debug";
import Mongoose from "mongoose";

const debug = debugFactory("backend/database");

export let database: Mongoose.Connection;

// TODO make configurable
const MONGO_USERNAME = "development";
const MONGO_PASSWORD = "development";
const MONGO_ENDPOINT = "localhost";
const MONGO_DATABASE = "development"; // TODO figure out why this throws an auth failure if we set this to something

export const getConnectionString = () => {
  const uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_ENDPOINT}`;
  debug("getConnectionString", uri);
  return uri;
};

export const dropDatabase = async () => {
  debug("dropping database");
  await database.dropDatabase();
  debug("database dropped");
};

export const connect = async () => {
  const uri = getConnectionString();

  if (database) {
    throw new Error(
      "attempted to connect while there was already an existing databsae connection"
    );
  }

  await Mongoose.connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  database = Mongoose.connection;

  await dropDatabase(); // TODO remove this after we wish to keep the database

  database.once("open", async () => {
    console.log(`connected to database via ${uri}`);
  });
  database.on("error", (err) => {
    console.log(`error connecting to database via ${uri}`, err);
  });

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
