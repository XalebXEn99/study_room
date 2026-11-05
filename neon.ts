import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  functions: {
    studyapi: { name: "Study Room private files and history", source: "./cloud/index.mjs" },
  },
  buckets: {
    "study-files": { access: "private" },
  },
  branch: (branch) => {
    if (branch.isDefault) {
      return {};
    }
    if (!branch.exists) {
      return { ttl: "7d" };
    }
    return {};
  },
});
