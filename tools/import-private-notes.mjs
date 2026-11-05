import { readdir, readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";
import { createStore } from "../cloud/store.mjs";

const ownerIndex = process.argv.indexOf("--owner");
const ownerId = ownerIndex === -1 ? null : process.argv[ownerIndex + 1];
if (!ownerId || !/^[0-9a-f-]{36}$/i.test(ownerId)) {
  throw new Error("Pass --owner followed by your Managed Better Auth user ID, not your Neon organization ID.");
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
const files = new Files({ adapter: neon({ bucket: "study-files" }) });
const store = createStore(pool, {
  write: (key, raw) => files.upload(key, raw, { contentType: "text/markdown; charset=utf-8" }),
  read: async key => (await files.download(key)).text(),
  remove: key => files.delete(key)
});
try {
  const { rows } = await pool.query('select id from neon_auth."user" where id = $1', [ownerId]);
  if (!rows.length) throw new Error("The requested owner does not exist in this branch's Managed Better Auth.");
  const existing = new Set();
  let after = null;
  do {
    const page = await store.list(ownerId, after);
    page.items.forEach(file => existing.add(file.name));
    after = page.next;
  } while (after);
  let count = 0;
  const root = new URL("../private-notes/", import.meta.url);
  for (const collection of ["maths", "sdp"]) {
    const folder = new URL(collection + "/", root);
    for (const name of await readdir(folder)) {
      if (!name.endsWith(".md") || existing.has(name)) continue;
      await store.save(ownerId, randomUUID(), {
        name, raw: await readFile(new URL(name, folder), "utf8"),
        origin: "upload", theme: "default", closed: true, version: 0
      });
      count++;
    }
  }
  console.log("Imported " + count + " private notes. Existing documents were not overwritten.");
} finally {
  await pool.end();
}
