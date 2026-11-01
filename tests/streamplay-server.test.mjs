import assert from "node:assert/strict";
import test from "node:test";
import { once } from "node:events";
import { createBridge } from "../tools/streamplay-server.mjs";
import { isPublicIpv4, validatePublicUrl } from "../tools/public-fetch.mjs";
import { STUDY_NOTES } from "../study-data.js";

async function bridge(t, settings = {}) {
  const server = createBridge({ tmdbToken: "", ...settings });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise(resolve => {
    server.closeAllConnections();
    server.close(resolve);
  }));
  const base = "http://127.0.0.1:" + server.address().port;
  return (path, options) => fetch(base + path, options);
}

function resolved(url = "https://media.example/film.mp4") {
  return {
    provider: "vidlink",
    streams: [{ quality: "720", type: "mp4", url, headers: { "User-Agent": "provider-agent" } }],
    subtitles: []
  };
}

test("serves the real application and exposes explicit search setup status", async t => {
  const get = await bridge(t);
  const home = await get("/");
  const html = await home.text();
  assert.match(html, /checklist-panel/);
  assert.doesNotMatch(html, /streamplay-(?:panel|dialog)|streamplay\.(?:js|css)/);
  assert.equal((await get("/streamplay.js")).status, 404);
  assert.equal((await get("/streamplay.css")).status, 404);
  assert.match(html, /href="graphic-design\.css"/);
  const graphicStyles = await get("/graphic-design.css");
  assert.equal(graphicStyles.status, 200);
  assert.match(graphicStyles.headers.get("content-type"), /text\/css/);
  assert.match(await graphicStyles.text(), /data-theme="gd-handwritten"/);
  for (const path of ["/library.js", "/study-data.js", "/timer.js", "/timer-state.js"]) {
    const asset = await get(path);
    assert.equal(asset.status, 200);
    assert.match(asset.headers.get("content-type"), /javascript/);
  }
  const status = await (await get("/api/status")).json();
  assert.equal(status.searchConfigured, false);
  assert.equal((await get("/api/search?q=Sintel")).status, 503);
  assert.equal((await (await get("/api/demo")).json()).id, 45745);
  assert.equal((await get("/tools/streamplay-server.mjs")).status, 404);
  assert.equal((await get("/.env")).status, 404);
  assert.equal((await get("/drive.js")).status, 404);
  for (const note of STUDY_NOTES) {
    const response = await get("/" + note.url);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/markdown/);
    assert.match(await response.text(), /^#/);
  }
});

test("rejects cross-origin calls, unsupported methods and invalid selections", async t => {
  const get = await bridge(t);
  assert.equal((await get("/api/status", { headers: { Origin: "https://untrusted.example" } })).status, 403);
  assert.equal((await get("/api/status", { headers: { "Sec-Fetch-Site": "cross-site" } })).status, 403);
  assert.equal((await get("/api/status", { method: "POST" })).status, 405);
  assert.equal((await get("/api/resolve?type=movie&id=-1")).status, 400);
  assert.equal((await get("/api/resolve?type=tv&id=1&season=1")).status, 400);
  assert.equal((await get("/api/media/not-a-session")).status, 410);
});

test("uses a server-only TMDB token and maps search and episodes", async t => {
  const calls = [];
  const responses = [
    { results: [
      { id: 1, media_type: "movie", title: "Test", release_date: "2020-01-01", poster_path: "/poster.jpg" },
      { id: 2, media_type: "person", name: "Excluded" }
    ] },
    { seasons: [{ season_number: 0, name: "Specials", episode_count: 2 }] },
    { episodes: [{ episode_number: 1, name: "Episode" }] }
  ];
  const get = await bridge(t, {
    tmdbToken: "test-token",
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return Response.json(responses.shift());
    }
  });
  const search = await (await get("/api/search?q=A%26B")).json();
  assert.equal(search.results.length, 1);
  assert.equal(search.results[0].title, "Test");
  assert.equal(search.results[0].thumbnail, "https://image.tmdb.org/t/p/w342/poster.jpg");
  assert.equal(calls[0].options.headers.Authorization, "Bearer test-token");
  assert.match(calls[0].url, /query=A%26B$/);
  const seasons = await (await get("/api/details?type=tv&id=1")).json();
  assert.equal(seasons.seasons[0].number, 0);
  const episodes = await (await get("/api/details?type=tv&id=1&season=0")).json();
  assert.equal(episodes.episodes[0].number, 1);
});

test("returns only opaque media tickets and relays bounded ranges and headers", async t => {
  let upstream;
  const get = await bridge(t, {
    resolveImpl: async () => resolved(),
    fetchImpl: async (url, options) => {
      upstream = { url, options };
      return new Response(new Uint8Array([0, 0, 0, 24, 102, 116, 121, 112]), {
        status: 206,
        headers: { "Content-Type": "video/mp4", "Content-Range": "bytes 0-7/100", "Accept-Ranges": "bytes" }
      });
    }
  });
  const result = await (await get("/api/resolve?type=movie&id=45745")).json();
  assert.match(result.streams[0].url, /^\/api\/media\/[a-f0-9]{48}$/);
  assert.equal(result.streams[0].headers, undefined);
  const media = await get(result.streams[0].url, { headers: { Range: "bytes=0-7" } });
  assert.equal(media.status, 206);
  assert.equal(media.headers.get("content-range"), "bytes 0-7/100");
  assert.equal((await media.arrayBuffer()).byteLength, 8);
  assert.equal(upstream.options.headers.Range, "bytes=0-7");
  assert.equal(upstream.options.headers["User-Agent"], "provider-agent");
  assert.equal((await get(result.streams[0].url, { headers: { Range: "bytes=0-1,4-5" } })).status, 416);
});

test("never turns upstream media failures into successful video responses", async t => {
  const get = await bridge(t, {
    resolveImpl: async () => resolved(),
    fetchImpl: async () => new Response("428 Forbidden", { status: 428 })
  });
  const data = await (await get("/api/resolve?type=movie&id=45745")).json();
  const response = await get(data.streams[0].url);
  assert.equal(response.status, 502);
  assert.match((await response.json()).error, /HTTP 428/);
});

test("rewrites HLS variants, segments and key URIs into reusable local tickets", async t => {
  const get = await bridge(t, {
    resolveImpl: async () => resolved("https://media.example/hls/master.m3u8"),
    fetchImpl: async () => new Response('#EXTM3U\n#EXT-X-KEY:METHOD=AES-128,URI="key.bin"\nvariant/index.m3u8\n', {
      headers: { "Content-Type": "application/vnd.apple.mpegurl" }
    })
  });
  const data = await (await get("/api/resolve?type=movie&id=45745")).json();
  const first = await (await get(data.streams[0].url)).text();
  assert.match(first, /URI="\/api\/media\/[a-f0-9]{48}"/);
  assert.doesNotMatch(first, /https:|key.bin|variant\/index/);
  const second = await (await get(data.streams[0].url)).text();
  assert.equal(first, second);
});

test("rejects private addresses and unsafe URL forms before network access", () => {
  for (const ip of ["127.0.0.1", "10.1.1.1", "172.16.0.1", "192.168.1.1",
    "169.254.169.254", "100.64.0.1", "0.0.0.0", "224.1.1.1", "198.18.0.1"]) {
    assert.equal(isPublicIpv4(ip), false, ip);
  }
  assert.equal(isPublicIpv4("104.21.84.216"), true);
  for (const url of ["http://media.example/a", "https://127.0.0.1/a", "https://[::1]/a",
    "https://localhost/a", "https://user:pass@media.example/a", "https://media.example:8443/a"]) {
    assert.throws(() => validatePublicUrl(url));
  }
  assert.equal(validatePublicUrl("https://media.example/a").hostname, "media.example");
});

test("supports authenticated GitHub Pages API calls and capability-based media CORS", async t => {
  const token = "test-access-token-at-least-32-characters";
  const origin = "https://xalebxen99.github.io";
  const get = await bridge(t, {
    publicUrl: "https://bridge.example",
    bridgeToken: token,
    resolveImpl: async () => resolved(),
    fetchImpl: async () => new Response("media", { headers: { "Content-Type": "video/mp4" } })
  });
  const preflight = await get("/api/resolve", {
    method: "OPTIONS", headers: {
      Origin: origin,
      "Access-Control-Request-Method": "GET",
      "Access-Control-Request-Headers": "authorization"
    }
  });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), origin);
  assert.equal((await get("/api/status", { headers: { Origin: origin } })).status, 401);
  const headers = { Origin: origin, Authorization: "Bearer " + token };
  assert.equal((await get("/api/status", { headers })).status, 200);
  assert.equal((await get("/api/status", {
    headers: { ...headers, Origin: "https://untrusted.example" }
  })).status, 403);
  const data = await (await get("/api/resolve?type=movie&id=45745", { headers })).json();
  const media = await get(data.streams[0].url, { headers: { Origin: origin } });
  assert.equal(media.status, 200);
  assert.equal(media.headers.get("access-control-allow-origin"), origin);
  assert.equal(await media.text(), "media");
});

test("refuses an unsafe public bridge configuration", () => {
  assert.throws(() => createBridge({ publicUrl: "http://bridge.example" }), /HTTPS/);
  assert.throws(() => createBridge({ publicUrl: "https://bridge.example", bridgeToken: "short" }), /32 characters/);
});
