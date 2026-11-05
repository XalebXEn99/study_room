import { Pool } from "pg";
import { attachDatabasePool } from "@neon/functions";
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";
import { createRemoteJWKSet, jwtVerify, errors } from "jose";
import { createApi } from "./api.mjs";
import { createStore } from "./store.mjs";

for (const name of ["DATABASE_URL", "NEON_AUTH_BASE_URL", "NEON_AUTH_JWKS_URL"]) {
  if (!process.env[name]) throw new Error(name + " is required.");
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);
const files = new Files({ adapter: neon({ bucket: "study-files" }) });
const store = createStore(pool, {
  write: (key, raw) => files.upload(key, raw, { contentType: "text/markdown; charset=utf-8", cacheControl: "private, no-store" }),
  read: async key => (await files.download(key)).text(),
  remove: key => files.delete(key)
});
const jwks = createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL));
const issuer = new URL(process.env.NEON_AUTH_BASE_URL).origin;

export default createApi({
  store,
  origins: ["https://study.thestone.co.za", "https://xalebxen99.github.io"],
  async verify(token) {
    try {
      const { payload } = await jwtVerify(token, jwks, { issuer, algorithms: ["EdDSA"] });
      return typeof payload.sub === "string" && payload.sub.length <= 200 && payload.role !== "anonymous" ? payload.sub : null;
    } catch (error) {
      if (error instanceof errors.JOSEError) return null;
      throw error;
    }
  }
});
