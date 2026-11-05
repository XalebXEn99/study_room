import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { fileURLToPath } from "node:url";

const connectionString = process.env.DATABASE_URL_UNPOOLED;
if (!connectionString) throw new Error("DATABASE_URL_UNPOOLED is required for cloud migrations.");
const pool = new Pool({ connectionString, max: 1 });
try {
  await migrate(drizzle(pool), { migrationsFolder: fileURLToPath(new URL("../cloud/migrations", import.meta.url)) });
  console.log("Study Room cloud migrations applied.");
} finally {
  await pool.end();
}
