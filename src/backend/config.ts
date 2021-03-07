import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.COMP3100_PORT || 4000;

export const DROP_DB_ON_START =
  process.env.COMP3100_DROP_DB_ON_START === "true";

export const MONGO_CONNECTION_STRING =
  process.env.COMP3100_MONGO_CONNECTION_STRING || "mongodb://localhost";

export const SESSION_SECRET =
  process.env.COMP3100_SESSION_SECRET || "super special secret";
