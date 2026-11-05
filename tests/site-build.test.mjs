import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, mkdir, writeFile, readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("the Pages artifact uses an allowlist and removes stale private or server files", async () => {
  const stale = new URL("../dist/private-notes/", import.meta.url);
  await mkdir(stale, { recursive: true });
  await writeFile(new URL("must-not-publish.md", stale), "Stale build fixture");
  execFileSync(process.execPath, [fileURLToPath(new URL("../tools/build-site.mjs", import.meta.url))], {
    cwd: new URL("../", import.meta.url),
    stdio: "pipe"
  });
  const root = new URL("../dist/", import.meta.url);
  for (const path of ["index.html", "cloud.js", "cloud-sync.js", "cloud-config.js", "assets/vendor/neon-auth.js"]) {
    await access(new URL(path, root));
  }
  assert.equal((await readFile(new URL("CNAME", root), "utf8")).trim(), "study.thestone.co.za");
  for (const path of ["private-notes", ".env.local", ".neon", "node_modules", "cloud", "tools",
    "assets/maths", "assets/sdp", "assets/os-book.zip"]) {
    await assert.rejects(access(new URL(path, root)), error => error.code === "ENOENT", path);
  }
  assert.deepEqual((await readdir(new URL("assets/", root))).sort(), ["motivation", "themes", "vendor"]);
});
