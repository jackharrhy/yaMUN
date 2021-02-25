import Mongoose from "mongoose";

export let database: Mongoose.Connection;

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

  database.once("open", async () => {
    console.log("Connected to database");
  });
  database.on("error", () => {
    console.log("Error connecting to database");
  });
};

export const disconnect = () => {
  if (!database) {
    throw new Error(
      "attempted to disconnect while there was not an existing databsae connection"
    );
  }
  Mongoose.disconnect();
};
