import * as pg from "pg";

import { DATABASE_URL } from "../config";

const pool = new pg.Pool({ connectionString: DATABASE_URL });
pool.on("error", (error) => console.error(error));

export default pool;
