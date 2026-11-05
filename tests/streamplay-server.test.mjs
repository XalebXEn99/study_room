import assert from "node:assert/strict";
import test from "node:test";
import { once } from "node:events";
import { get as httpGet } from "node:http";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createBridge } from "../tools/streamplay-server.mjs";
import { isPublicIpv4, validatePublicUrl } from "../tools/public-fetch.mjs";
import { MOTIVATION_QUOTES } from "../motivation-data.js";
import { ANIME_BACKGROUNDS } from "../anime-background-data.js";
import readerAssets from "../assets/vendor/manifest.json" with { type: "json" };

async function bridge(t, settings = {}, hostname = "127.0.0.1") {
  const server = createBridge({ tmdbToken: "", ...settings });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise(resolve => {
    server.closeAllConnections();
    server.close(resolve);
  }));
  const base = "http://" + hostname + ":" + server.address().port;
  return (path, options) => fetch(base + path, options);
}

function resolved(url = "https://media.example/film.mp4") {
  return {
    provider: "vidlink",
    streams: [{ quality: "720", type: "mp4", url, headers: { "User-Agent": "provider-agent" } }],
    subtitles: []
  };
}

test("localhost serves the study app and permits only its own host and origin", async t => {
  const get = await bridge(t, {}, "localhost");
  const home = await get("/");
  assert.equal(home.status, 200);
  assert.match(await home.text(), /<title>Study Room<\/title>/);
  const origin = new URL(home.url).origin;
  const headers = { Origin: origin, "Sec-Fetch-Site": "same-origin" };
  const status = await get("/api/status", { headers });
  assert.equal(status.status, 200);
  assert.equal(status.headers.get("access-control-allow-origin"), origin);
  for (const path of ["/cloud.js", "/assets/vendor/marked/marked.umd.js"]) {
    assert.equal((await get(path, { headers })).status, 200, path);
  }
  for (const invalidHeaders of [
    { Origin: "https://untrusted.example" },
    { Origin: origin.replace("http:", "https:") },
    { Origin: "http://localhost:1" },
    { "Sec-Fetch-Site": "cross-site" }
  ]) {
    assert.equal((await get("/api/status", { headers: invalidHeaders })).status, 403);
  }
  // Raw HTTP preserves Host; fetch normalises it to the request URL.
  for (const host of ["untrusted.example", "localhost:1", "localhost.untrusted.example:" + new URL(origin).port]) {
    const statusCode = await new Promise((resolve, reject) => {
      httpGet(origin + "/api/status", { headers: { Host: host } }, response => {
        response.once("error", reject);
        response.resume().once("end", () => resolve(response.statusCode));
      }).once("error", reject);
    });
    assert.equal(statusCode, 403, host);
  }
});

test("PiP serves a real same-origin player document with the required referrer policy", async t => {
  const get = await bridge(t, {}, "localhost");
  const response = await get("/youtube-pip.html");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  const html = await response.text();
  assert.match(html, /<meta name="referrer" content="strict-origin-when-cross-origin">/);
  assert.match(html, /iframe \{[^}]*width: 100%; height: 100%/);
  assert.match(html, /<title>YouTube - Study Room<\/title>/);
});

test("the reader serves bundled libraries, theme styles and maths fonts without CDNs", async t => {
  const get = await bridge(t);
  const html = await (await get("/")).text();
  const app = await (await get("/app.js")).text();
  assert.doesNotMatch(html + app, /https:\/\/(?:cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)/);
  for (const library of ["marked/marked.umd.js", "highlight/highlight.min.js", "katex/katex.min.js",
    "mermaid/mermaid.min.js", "dompurify/purify.min.js"]) {
    assert.ok(html.includes('src="assets/vendor/' + library + '"'));
  }
  const paths = new Set(readerAssets.map(asset => asset.path));
  for (const match of app.matchAll(/"(assets\/vendor\/[^"]+\.css)"/g)) assert.ok(paths.has(match[1]));
  const css = await readFile(new URL("../assets/vendor/katex/katex.min.css", import.meta.url), "utf8");
  for (const match of css.matchAll(/url\((fonts\/[^)]+)\)/g)) assert.ok(paths.has("assets/vendor/katex/" + match[1]));
  for (const asset of readerAssets) {
    const response = await get("/" + asset.path);
    assert.equal(response.status, 200, asset.path);
    assert.equal(response.headers.get("content-type"), asset.type, asset.path);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256, asset.path);
  }
});

test("serves the real application and exposes explicit search setup status", async t => {
  const get = await bridge(t);
  const home = await get("/");
  const html = await home.text();
  assert.match(html, /checklist-panel/);
  assert.match(html, /id="account-form"/);
  assert.match(html, /id="cloud-history"/);
  assert.match(html, /id="timer-floating"/);
  assert.match(html, /id="motivation-dialog"/);
  assert.match(html, /data-family="graphic-design"[\s\S]*data-theme="gd-90s-anime"/);
  assert.match(html, /data-theme="gd-cityscape"/);
  assert.match(html, /id="anime-background"[^>]*hidden[^>]*aria-hidden="true"/);
  assert.match(html, /type="module" src="anime-background\.js"/);
  assert.doesNotMatch(html, /streamplay-(?:panel|dialog)|streamplay\.(?:js|css)/);
  assert.equal((await get("/streamplay.js")).status, 404);
  assert.equal((await get("/streamplay.css")).status, 404);
  assert.match(html, /href="graphic-design\.css"/);
  const graphicStyles = await get("/graphic-design.css");
  assert.equal(graphicStyles.status, 200);
  assert.match(graphicStyles.headers.get("content-type"), /text\/css/);
  const css = await graphicStyles.text();
  assert.match(css, /data-theme="gd-handwritten"/);
  assert.match(css, /data-theme="gd-90s-anime"/);
  assert.match(css, /data-theme="gd-cityscape"/);
  assert.match(css, /assets\/themes\/90s-anime-sky\.svg/);
  const animeSky = await get("/assets/themes/90s-anime-sky.svg");
  assert.equal(animeSky.status, 200);
  assert.match(animeSky.headers.get("content-type"), /image\/svg\+xml/);
  assert.match(await animeSky.text(), /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  for (const scene of ANIME_BACKGROUNDS) {
    const image = await get("/" + scene.url);
    assert.equal(image.status, 200);
    assert.match(image.headers.get("content-type"), /image\/png/);
    const bytes = Buffer.from(await image.arrayBuffer());
    assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.ok(bytes.readUInt32BE(16) >= 1400);
    assert.ok(bytes.readUInt32BE(20) >= 700);
  }
  for (const path of ["/library.js", "/study-data.js", "/timer.js", "/timer-state.js", "/motivation.js", "/motivation-data.js", "/anime-background.js", "/anime-background-data.js"]) {
    const asset = await get(path);
    assert.equal(asset.status, 200);
    assert.match(asset.headers.get("content-type"), /javascript/);
  }
  const voice = await get("/" + MOTIVATION_QUOTES[0].audio);
  assert.equal(voice.status, 200);
  assert.match(voice.headers.get("content-type"), /audio\/mpeg/);
  assert.equal(Buffer.from(await voice.arrayBuffer()).toString("ascii", 0, 3), "ID3");
  const status = await (await get("/api/status")).json();
  assert.equal(status.searchConfigured, false);
  assert.equal((await get("/api/search?q=Sintel")).status, 503);
  assert.equal((await (await get("/api/demo")).json()).id, 45745);
  assert.equal((await get("/tools/streamplay-server.mjs")).status, 404);
  assert.equal((await get("/.env")).status, 404);
  assert.equal((await get("/drive.js")).status, 404);
  for (const path of ["/assets/maths/Study-Plan.md", "/assets/sdp/SDP-Exam-Tips.md",
    "/private-notes/maths/Study-Plan.md", "/assets/os-book.zip", "/cloud/index.mjs", "/.env.local"]) {
    assert.equal((await get(path)).status, 404, path);
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
  const origin = "https://study.thestone.co.za";
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

test("supports an explicitly configured frontend origin", async t => {
  const token = "test-access-token-at-least-32-characters";
  const origin = "https://xalebxen99.github.io";
  const get = await bridge(t, {
    publicUrl: "https://bridge.example",
    bridgeToken: token,
    frontendOrigin: origin
  });
  const response = await get("/api/status", {
    headers: { Origin: origin, Authorization: "Bearer " + token }
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), origin);
  assert.equal((await get("/api/status", {
    headers: { Origin: "https://study.thestone.co.za", Authorization: "Bearer " + token }
  })).status, 403);
});

test("refuses an unsafe public bridge configuration", () => {
  assert.throws(() => createBridge({ publicUrl: "http://bridge.example" }), /HTTPS/);
  assert.throws(() => createBridge({ publicUrl: "https://bridge.example", bridgeToken: "short" }), /32 characters/);
});
