import * as dotenv from "dotenv";

dotenv.config();

export const DATABASE_URL =
  process.env.YAMUN_DATABASE_URL ||
  "postgres://postgres:password@localhost:5432/postgres";

export const YEAR_TO_START_FETCHING_COURSES_FROM =
  Number(process.env.YAMUN_YEAR_TO_START_FETCHING_COURSES_FROM) || 2000;
