import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.YAMUN_PORT || 4000;

export const DROP_DB_ON_START = process.env.YAMUN_DROP_DB_ON_START === "true";

export const MONGO_CONNECTION_STRING =
  process.env.YAMUN_MONGO_CONNECTION_STRING || "mongodb://localhost";

export const MONGO_DATABASE = process.env.YAMUN_MONGO_DATABASE || "yamun";
export const MONGO_TEST_DATABASE =
  process.env.YAMUN_MONGO_TEST_DATABASE || "yamuntest";

export const SESSION_SECRET =
  process.env.YAMUN_SESSION_SECRET || "super special secret";
