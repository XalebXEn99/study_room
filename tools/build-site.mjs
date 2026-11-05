import { cp, mkdir, rm } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const target = new URL("../dist/", import.meta.url);
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
const files = [
  "CNAME", "index.html", "youtube-pip.html", "style.css", "graphic-design.css", "app.js",
  "library.js", "study-data.js", "timer.js", "timer-state.js", "motivation.js",
  "motivation-data.js", "anime-background.js", "anime-background-data.js",
  "spotify.js", "youtube.js", "cloud.js", "cloud-sync.js", "cloud-config.js"
];
for (const name of files) await cp(new URL(name, root), new URL(name, target));
for (const directory of ["vendor", "motivation", "themes"]) {
  const path = "assets/" + directory + "/";
  await cp(new URL(path, root), new URL(path, target), { recursive: true });
}
console.log("Built the static site without server code, secrets, or private notes.");
