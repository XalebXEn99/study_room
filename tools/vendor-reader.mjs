import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const root = fileURLToPath(new URL("../assets/vendor/", import.meta.url));
const run = promisify(execFile);
const cdn = "https://cdn.jsdelivr.net/npm/";
const sources = [
  ["marked/marked.umd.js", cdn + "marked@14.1.0/lib/marked.umd.js"],
  ["marked/LICENSE.md", cdn + "marked@14.1.0/LICENSE.md"],
  ["highlight/highlight.min.js", cdn + "@highlightjs/cdn-assets@11.10.0/highlight.min.js"],
  ["highlight/LICENSE", cdn + "@highlightjs/cdn-assets@11.10.0/LICENSE"],
  ...["github", "atom-one-light", "tokyo-night-dark", "base16/nord", "base16/dracula", "atom-one-dark", "arta", "monokai"]
    .map(name => ["highlight/styles/" + name + ".min.css",
      cdn + "@highlightjs/cdn-assets@11.10.0/styles/" + name + ".min.css"]),
  ["katex/katex.min.js", cdn + "katex@0.16.11/dist/katex.min.js"],
  ["katex/katex.min.css", cdn + "katex@0.16.11/dist/katex.min.css"],
  ["katex/LICENSE", cdn + "katex@0.16.11/LICENSE"],
  ["mermaid/mermaid.min.js", cdn + "mermaid@11.17.2/dist/mermaid.min.js"],
  ["mermaid/LICENSE", cdn + "mermaid@11.17.2/LICENSE"],
  ["dompurify/purify.min.js", cdn + "dompurify@3.4.17/dist/purify.min.js"],
  ["dompurify/LICENSE", cdn + "dompurify@3.4.17/LICENSE"]
];
const types = { ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf" };
const files = [];

async function download([path, source]) {
  const { stdout: contents } = await run(process.platform === "win32" ? "curl.exe" : "curl", [
    "--fail", "--location", "--silent", "--show-error", "--retry", "2",
    "--connect-timeout", "30", "--max-time", "120", source
  ], { encoding: "buffer", maxBuffer: 16 * 1024 * 1024 });
  const target = join(root, ...path.split("/"));
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
  files.push({
    path: "assets/vendor/" + path,
    source,
    type: types[path.slice(path.lastIndexOf("."))] || "text/plain; charset=utf-8",
    sha256: createHash("sha256").update(contents).digest("hex")
  });
  return contents;
}

for (let i = 0; i < sources.length; i += 4) {
  const batch = sources.slice(i, i + 4);
  const contents = await Promise.all(batch.map(download));
  batch.forEach(([path, source], index) => {
    if (path !== "katex/katex.min.css") return;
    const fonts = new Set([...contents[index].toString().matchAll(/url\((fonts\/[^)]+)\)/g)].map(match => match[1]));
    for (const font of fonts) sources.push(["katex/" + font, new URL(font, source).href]);
  });
}
files.sort((a, b) => a.path.localeCompare(b.path));
await writeFile(join(root, "manifest.json"), JSON.stringify(files, null, 2) + "\n");
console.log("Bundled " + files.length + " reader assets with licenses and SHA-256 checksums.");
