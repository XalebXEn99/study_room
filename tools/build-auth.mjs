import { build } from "esbuild";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const result = await build({
  stdin: { contents: 'export { createAuthClient } from "@neon/auth";', resolveDir: process.cwd(), sourcefile: "neon-auth-client.js" },
  outfile: "assets/vendor/neon-auth.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  minify: true,
  metafile: true,
  legalComments: "eof"
});
const roots = new Set();
for (const input of Object.keys(result.metafile.inputs)) {
  const path = input.replaceAll("\\", "/");
  const match = [...path.matchAll(/(?:^|\/)node_modules\/((?:@[^/]+\/)?[^/]+)/g)].at(-1);
  if (match) roots.add(resolve(path.slice(0, match.index + match[0].length)));
}
const notices = [];
for (const root of roots) {
  const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  const licenses = (await readdir(root)).filter(name => /^(license|notice|copying)(\.|$)/i.test(name));
  if (!licenses.length) throw new Error("Missing redistribution notice for " + pkg.name);
  notices.push(pkg.name + " " + pkg.version);
  for (const license of licenses) notices.push(await readFile(join(root, license), "utf8"));
}
await writeFile("assets/vendor/neon-auth-NOTICES.txt", notices.join("\n\n-----\n\n"));
console.log("Built the managed Better Auth browser client.");
