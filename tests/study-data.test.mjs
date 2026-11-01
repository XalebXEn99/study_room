import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { STUDY_NOTES, BOOK_DOWNLOAD, YOUTUBE_COLLECTION, SPOTIFY_COLLECTION } from "../study-data.js";

test("the maths and SDP catalogue entries resolve to bundled Markdown", async () => {
  assert.equal(STUDY_NOTES.length, 9);
  assert.equal(STUDY_NOTES.filter(note => note.collection === "maths").length, 8);
  assert.equal(STUDY_NOTES.filter(note => note.collection === "sdp").length, 1);
  assert.equal(new Set(STUDY_NOTES.map(note => note.id)).size, 9);
  assert.equal(new Set(STUDY_NOTES.map(note => note.url)).size, 9);
  for (const note of STUDY_NOTES) {
    assert.ok(["maths", "sdp"].includes(note.collection));
    assert.match(note.name, /\.md$/);
    assert.equal(note.url, "assets/" + note.collection + "/" + note.name);
    const raw = await readFile(new URL("../" + note.url, import.meta.url), "utf8");
    assert.match(raw, /^#/);
  }
});

test("AA practice preserves the supplied progress and five-item revision map", async () => {
  const note = STUDY_NOTES.find(item => item.id === "aa-practice");
  assert.ok(note);
  assert.equal(note.title, "AA practice");
  assert.equal(note.collection, "maths");
  const raw = await readFile(new URL("../" + note.url, import.meta.url), "utf8");
  assert.match(raw, /^# AA practice$/m);
  assert.match(raw, /\| Progress 15% \| Progress 10% \|/);
  assert.match(raw, /^### My progress map$/m);
  assert.equal(raw.split("\n").filter(line => line.startsWith("- ")).length, 5);
  for (const topic of ["Definition of differentiable", "Riemann integrable", "refinement",
    "integrability condition", "partition question", "\\(U-L < \\epsilon\\)", "m_i", "M_i", "\\Delta x"]) {
    assert.ok(raw.includes(topic), "Missing revision topic: " + topic);
  }
});

test("SDP exam tips include the requested links and lab revision material without private paths or credentials", async () => {
  const note = STUDY_NOTES.find(item => item.id === "sdp-exam-tips");
  assert.ok(note);
  const raw = await readFile(new URL("../" + note.url, import.meta.url), "utf8");
  for (const url of ["https://sitereel.ai/", "https://manus.im/", "https://preline.co/", "https://www.theatrejs.com/"]) {
    assert.ok(raw.includes(url), "Missing resource: " + url);
  }
  assert.match(raw, /^## AI coding safety: short checklist/m);
  assert.match(raw, /^## Docker lab/m);
  assert.match(raw, /service_healthy/);
  assert.match(raw, /docker compose up --build -d/);
  assert.doesNotMatch(raw, /C:\\Users\\/i);
  assert.doesNotMatch(raw, /postgres(?:ql)?:\/\/[^/\s:]+:[^@\s]+@/i);
});

test("the book download is a complete ZIP release asset, not a local machine path", () => {
  const url = new URL(BOOK_DOWNLOAD.url);
  assert.equal(url.origin, "https://github.com");
  assert.equal(url.pathname, "/XalebXEn99/study_room/releases/download/study-resources-2026/os-book.zip");
  assert.equal(BOOK_DOWNLOAD.name, "os-book.zip");
});

test("saved YouTube entries contain only the requested SDP playlist", () => {
  assert.deepEqual(YOUTUBE_COLLECTION.map(item => item.url), [
    "https://www.youtube.com/playlist?list=PLek4jWKl7ylE"
  ]);
  assert.equal(YOUTUBE_COLLECTION.length, 1);
  assert.equal(YOUTUBE_COLLECTION.at(-1).title, "SDP - Software Development Party");
});

test("saved Spotify entries match all eight supplied playlist IDs", () => {
  assert.deepEqual(SPOTIFY_COLLECTION.map(item => item.url), [
    "https://open.spotify.com/playlist/6g0Z73wQf2UDEXnCglvqCK",
    "https://open.spotify.com/playlist/4FXIexXCIREWCSREF6GosY",
    "https://open.spotify.com/playlist/4wqF0CBDNfp8jgdrrtLXeG",
    "https://open.spotify.com/playlist/37i9dQZF1DX08mhnhv6g9b",
    "https://open.spotify.com/playlist/7ED3tauJjkhapme2NOK4Se",
    "https://open.spotify.com/playlist/0w2wAaeArRZqB7bFgDTVlA",
    "https://open.spotify.com/playlist/62aVuuh673VINeAGi8zKPG",
    "https://open.spotify.com/playlist/5R0nzmDPHvv2w1oHhSLzuY"
  ]);
});
