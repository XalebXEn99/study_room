import assert from "node:assert/strict";
import test from "node:test";
import { MEDIA_USER_AGENT, probeMedia, resolveVidlink } from "../tools/streamplay-resolver.mjs";

function fixtureFetch(responses, calls = []) {
  return async (url, options) => {
    calls.push({ url, options });
    assert.ok(responses.length, "Unexpected network request");
    return responses.shift();
  };
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

function streamResponse() {
  return json({ stream: {
    qualities: {
      "720": {
        url: "https://media.example/video.mp4?token=keep-me",
        type: "mp4",
        headers: { Referer: "https://provider.example/" },
        requiresProxy: true
      }
    },
    captions: [{ url: "//media.example/en.srt", language: "English", type: "srt" }]
  } });
}

test("resolves a movie and applies source-required headers while preserving URL tokens", async () => {
  const calls = [];
  const result = await resolveVidlink({ tmdbId: 45745 }, {
    fetchImpl: fixtureFetch([json({ result: "token/+" }), streamResponse()], calls)
  });
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://enc-dec.app/api/enc-vidlink?text=45745");
  assert.equal(calls[1].url, "https://vidlink.pro/api/b/movie/token%2F%2B");
  assert.equal(calls[1].options.headers.Origin, "https://vidlink.pro");
  assert.equal(result.streams[0].url, "https://media.example/video.mp4?token=keep-me");
  assert.equal(result.streams[0].headers["User-Agent"], MEDIA_USER_AGENT);
  assert.equal(result.streams[0].headers.referer, undefined);
  assert.equal(result.streams[0].headers["Accept-Ranges"], "bytes");
  assert.equal(result.streams[0].requiresProxy, true);
  assert.equal(result.subtitles[0].url, "https://media.example/en.srt");
  assert.deepEqual(result.media, { tmdbId: 45745 });
});

test("supports TV episode routes including season zero", async () => {
  const calls = [];
  await resolveVidlink({ tmdbId: 123, season: 0, episode: 2 }, {
    fetchImpl: fixtureFetch([json({ result: "token" }), streamResponse()], calls)
  });
  assert.equal(calls[1].url, "https://vidlink.pro/api/b/tv/token/0/2");
});

test("rejects invalid IDs and incomplete episode selections before any network request", async () => {
  for (const media of [
    { tmdbId: 0 }, { tmdbId: "123" }, { tmdbId: NaN },
    { tmdbId: Number.MAX_SAFE_INTEGER + 1 },
    { tmdbId: 123, season: 1 }, { tmdbId: 123, episode: 1 },
    { tmdbId: 123, season: -1, episode: 1 },
    { tmdbId: 123, season: 1, episode: 0 }
  ]) {
    await assert.rejects(resolveVidlink(media, { fetchImpl: fixtureFetch([]) }));
  }
});

test("reports token-service failures without requesting the resolver", async () => {
  await assert.rejects(resolveVidlink({ tmdbId: 1 }, {
    fetchImpl: fixtureFetch([json({}, 403)])
  }), /Token service: HTTP 403/);
  await assert.rejects(resolveVidlink({ tmdbId: 1 }, {
    fetchImpl: fixtureFetch([json({})])
  }), /Token service returned no token/);
});

test("reports network failures and supplies an abort signal", async () => {
  await assert.rejects(resolveVidlink({ tmdbId: 1 }, {
    fetchImpl: async (url, { signal }) => {
      assert.ok(signal instanceof AbortSignal);
      throw new Error("network unavailable");
    }
  }), /Token service: network unavailable/);
});

test("rejects failed, malformed, and empty resolver responses", async () => {
  for (const response of [
    json({}, 429), new Response("<html>challenge</html>"),
    json({}), json({ stream: {} }), json({ stream: { qualities: [] } }),
    json({ stream: { qualities: { "720": { url: "javascript:alert(1)" } } } }),
    json({ stream: { qualities: { "720": { url: "https://media.example/a", headers: { a: 2 } } } } }),
    json({ stream: { playlist: "https://media.example/a.m3u8", captions: {} } })
  ]) {
    await assert.rejects(resolveVidlink({ tmdbId: 1 }, {
      fetchImpl: fixtureFetch([json({ result: "token" }), response])
    }));
  }
});

test("accepts an HLS playlist without inventing proxy or browser-playability guarantees", async () => {
  const result = await resolveVidlink({ tmdbId: 1 }, {
    fetchImpl: fixtureFetch([
      json({ result: "token" }),
      json({ stream: { playlist: "https://media.example/master.m3u8?headers=preserve" } })
    ])
  });
  assert.equal(result.streams[0].type, "hls");
  assert.equal(result.streams[0].requiresProxy, null);
  assert.equal(result.streams[0].url, "https://media.example/master.m3u8?headers=preserve");
  assert.deepEqual(result.subtitles, []);
});

test("probes only a range, validates MP4 bytes, and cancels the media body", async () => {
  let cancelled = false;
  const body = new ReadableStream({
    start(controller) { controller.enqueue(Buffer.from([0, 0, 0, 24, 102, 116, 121, 112])); },
    cancel() { cancelled = true; }
  });
  const calls = [];
  const result = await probeMedia({ url: "https://media.example/a.mp4", headers: {} }, {
    fetchImpl: fixtureFetch([new Response(body, {
      status: 206, headers: { "Content-Type": "video/mp4" }
    })], calls)
  });
  assert.equal(calls[0].options.headers.Range, "bytes=0-1023");
  assert.equal(result.format, "mp4");
  assert.equal(result.corsOrigin, null);
  assert.equal(cancelled, true);
});

test("recognizes HLS but never mistakes HTTP errors or challenge HTML for media", async () => {
  const candidate = { url: "https://media.example/a.m3u8", headers: {} };
  const result = await probeMedia(candidate, {
    fetchImpl: fixtureFetch([new Response("#EXTM3U\n#EXT-X-VERSION:3\n")])
  });
  assert.equal(result.format, "hls");
  await assert.rejects(probeMedia(candidate, {
    fetchImpl: fixtureFetch([new Response("Precondition required", { status: 428 })])
  }), /Media probe: HTTP 428/);
  await assert.rejects(probeMedia(candidate, {
    fetchImpl: fixtureFetch([new Response("<html>challenge</html>")])
  }), /not an MP4 header or HLS manifest/);
});
