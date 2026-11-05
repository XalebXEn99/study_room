import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./cloud/schema.mjs",
  out: "./cloud/migrations"
});
