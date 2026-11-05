import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { YOUTUBE_COLLECTION, SPOTIFY_COLLECTION } from "../study-data.js";

test("the public catalogue no longer publishes study-note paths or a public book download", async () => {
  const source = await readFile(new URL("../study-data.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /STUDY_NOTES|BOOK_DOWNLOAD|assets\/maths|assets\/sdp|releases\/download/);
});

test("saved YouTube entries preserve SDP and include all three new named playlists", () => {
  assert.deepEqual(YOUTUBE_COLLECTION.map(item => item.url), [
    "https://www.youtube.com/playlist?list=PLek4jWKl7ylE",
    "https://www.youtube.com/playlist?list=PLSEods_VwMdM_lnTura_7eF1ZCEdp2F4K",
    "https://www.youtube.com/playlist?list=PLsQL8_RNGq40jk82xFSqp3Fi0SapMNh3O",
    "https://www.youtube.com/playlist?list=PLeLvSt3A0Ddk9lGjNqmzT0ctVPA5xfinn"
  ]);
  assert.deepEqual(YOUTUBE_COLLECTION.map(item => item.title), [
    "SDP - Software Development Party",
    "Bakugan New Vestroia Full Episodes",
    "Bakugan Gundalian Invaders",
    "THE FIRST TAKE"
  ]);
});

test("saved Spotify entries match all ten playlist IDs and published names", () => {
  assert.deepEqual(SPOTIFY_COLLECTION.map(item => item.url), [
    "https://open.spotify.com/playlist/6g0Z73wQf2UDEXnCglvqCK",
    "https://open.spotify.com/playlist/4FXIexXCIREWCSREF6GosY",
    "https://open.spotify.com/playlist/4wqF0CBDNfp8jgdrrtLXeG",
    "https://open.spotify.com/playlist/37i9dQZF1DX08mhnhv6g9b",
    "https://open.spotify.com/playlist/7ED3tauJjkhapme2NOK4Se",
    "https://open.spotify.com/playlist/0w2wAaeArRZqB7bFgDTVlA",
    "https://open.spotify.com/playlist/62aVuuh673VINeAGi8zKPG",
    "https://open.spotify.com/playlist/5R0nzmDPHvv2w1oHhSLzuY",
    "https://open.spotify.com/playlist/04pgW0LzeStwtcl0twOqJf",
    "https://open.spotify.com/playlist/0t8MlOTyAMOIDKap8gaWol"
  ]);
  assert.deepEqual(SPOTIFY_COLLECTION.map(item => item.title), [
    "Replay 2025",
    "Playlist farm",
    "City Pop For My Soul",
    "This Is BTS",
    "Road trip 2022",
    "\u{1FAEA}It\u2019s my first time\u{1FAEA}",
    "Uhhhmm",
    "It must be love type shi",
    "Flow",
    "Love"
  ]);
});
