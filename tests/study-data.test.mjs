import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { STUDY_NOTES, BOOK_DOWNLOAD, YOUTUBE_COLLECTION, SPOTIFY_COLLECTION } from "../study-data.js";

test("the seven study-note catalogue entries resolve to bundled Markdown", async () => {
  assert.equal(STUDY_NOTES.length, 7);
  assert.equal(new Set(STUDY_NOTES.map(note => note.id)).size, 7);
  assert.equal(new Set(STUDY_NOTES.map(note => note.url)).size, 7);
  for (const note of STUDY_NOTES) {
    assert.match(note.name, /\.md$/);
    assert.equal(note.url, "assets/maths/" + note.name);
    const raw = await readFile(new URL("../" + note.url, import.meta.url), "utf8");
    assert.match(raw, /^#/);
    assert.ok(raw.length > 1000);
  }
});

test("the book download is a complete ZIP release asset, not a local machine path", () => {
  const url = new URL(BOOK_DOWNLOAD.url);
  assert.equal(url.origin, "https://github.com");
  assert.equal(url.pathname, "/XalebXEn99/study_room/releases/download/study-resources-2026/os-book.zip");
  assert.equal(BOOK_DOWNLOAD.name, "os-book.zip");
});

test("saved YouTube entries match the supplied video IDs with no duplicate URL", () => {
  assert.deepEqual(YOUTUBE_COLLECTION.map(item => item.url), [
    "https://youtu.be/C_Ch61m-PUs", "https://youtu.be/r0QEhffS8WE",
    "https://youtu.be/kWkea7Vjp9I", "https://youtu.be/NNt8FeJcEJQ"
  ]);
});

test("saved Spotify entries match all three supplied playlist IDs", () => {
  assert.deepEqual(SPOTIFY_COLLECTION.map(item => item.url), [
    "https://open.spotify.com/playlist/6g0Z73wQf2UDEXnCglvqCK",
    "https://open.spotify.com/playlist/4FXIexXCIREWCSREF6GosY",
    "https://open.spotify.com/playlist/4wqF0CBDNfp8jgdrrtLXeG"
  ]);
});
