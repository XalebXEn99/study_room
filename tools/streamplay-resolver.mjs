import { pathToFileURL } from "node:url";
import { publicFetch } from "./public-fetch.mjs";

const TOKEN_API = "https://enc-dec.app/api/enc-vidlink";
const PROVIDER = "https://vidlink.pro";
const USER_AGENT = "Mozilla/5.0";
export const MEDIA_USER_AGENT = "com.community.oneroom/50020115 (Linux; U; Android 15; en_US; OPPO CPH2579; Build/AP3A.240905.015.A2; Cronet/140.0.7339.51)";

export function mediaHeaders(value) {
  const headers = requestHeaders(value);
  for (const name of ["user-agent", "referer", "origin", "accept", "accept-ranges"]) {
    delete headers[name];
  }
  return {
    ...headers,
    "User-Agent": MEDIA_USER_AGENT,
    Accept: "*/*",
    "Accept-Ranges": "bytes"
  };
}

function object(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function mediaUrl(value) {
  if (typeof value !== "string") throw new Error("Provider returned a missing media URL.");
  const url = new URL(value.startsWith("//") ? "https:" + value : value);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("Provider returned an unsupported media URL.");
  }
  return url.href;
}

function requestHeaders(value) {
  if (value === undefined) return {};
  if (!object(value) || Object.values(value).some(item => typeof item !== "string")) {
    throw new Error("Provider returned invalid request headers.");
  }
  return Object.fromEntries(new Headers(value));
}

async function getJson(stage, url, headers, fetchImpl, timeoutMs) {
  try {
    const response = await fetchImpl(url, {
      headers,
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error("HTTP " + response.status);
    }
    return await response.json();
  } catch (error) {
    throw new Error(stage + ": " + error.message, { cause: error });
  }
}

export async function resolveVidlink(
  { tmdbId, season, episode },
  { fetchImpl = publicFetch, timeoutMs = 15000 } = {}
) {
  if (!Number.isSafeInteger(tmdbId) || tmdbId <= 0) {
    throw new Error("TMDB ID must be a positive safe integer.");
  }
  const isTv = season !== undefined || episode !== undefined;
  if (isTv && (!Number.isSafeInteger(season) || season < 0 ||
      !Number.isSafeInteger(episode) || episode <= 0)) {
    throw new Error("TV requests need a non-negative season and a positive episode.");
  }

  const encoded = await getJson(
    "Token service",
    TOKEN_API + "?text=" + tmdbId,
    { "User-Agent": USER_AGENT, Accept: "application/json" },
    fetchImpl, timeoutMs
  );
  if (!object(encoded) || typeof encoded.result !== "string" || !encoded.result.trim()) {
    throw new Error("Token service returned no token.");
  }

  const route = isTv ? "tv" : "movie";
  const suffix = isTv ? "/" + season + "/" + episode : "";
  const payload = await getJson(
    "VidLink resolver",
    PROVIDER + "/api/b/" + route + "/" + encodeURIComponent(encoded.result) + suffix,
    {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
      Origin: PROVIDER,
      Referer: PROVIDER + "/",
      "X-Playback-Environment": "standard"
    },
    fetchImpl, timeoutMs
  );
  if (!object(payload) || !object(payload.stream)) {
    throw new Error("VidLink resolver returned no stream object.");
  }
  const stream = payload.stream;
  const streams = [];
  if (stream.playlist !== undefined && stream.playlist !== null && stream.playlist !== "") {
    streams.push({
      quality: "auto",
      type: "hls",
      url: mediaUrl(stream.playlist),
      headers: {},
      requiresProxy: null
    });
  }
  if (stream.qualities !== undefined && !object(stream.qualities)) {
    throw new Error("VidLink resolver returned invalid qualities.");
  }
  for (const [quality, entry] of Object.entries(stream.qualities || {})) {
    if (!object(entry)) throw new Error("VidLink resolver returned an invalid quality entry.");
    streams.push({
      quality,
      type: entry.type || "unknown",
      url: mediaUrl(entry.url),
      headers: mediaHeaders(entry.headers),
      requiresProxy: typeof entry.requiresProxy === "boolean" ? entry.requiresProxy : null
    });
  }
  if (!streams.length) throw new Error("VidLink resolver returned no playable candidates.");
  if (stream.captions !== undefined && !Array.isArray(stream.captions)) {
    throw new Error("VidLink resolver returned invalid captions.");
  }
  const subtitles = (stream.captions || []).map(caption => {
    if (!object(caption)) throw new Error("VidLink resolver returned an invalid caption.");
    return {
      language: caption.language || "Unknown",
      type: caption.type || "unknown",
      url: mediaUrl(caption.url)
    };
  });
  return {
    provider: "vidlink",
    media: { tmdbId, ...(isTv ? { season, episode } : {}) },
    resolvedAt: new Date().toISOString(),
    streams,
    subtitles
  };
}

export async function probeMedia(candidate, { fetchImpl = publicFetch, timeoutMs = 15000 } = {}) {
  try {
    const response = await fetchImpl(mediaUrl(candidate.url), {
      headers: {
        ...requestHeaders(candidate.headers),
        "User-Agent": MEDIA_USER_AGENT,
        Range: "bytes=0-1023"
      },
      signal: AbortSignal.timeout(timeoutMs)
    });
    const contentType = response.headers.get("content-type") || "";
    const corsOrigin = response.headers.get("access-control-allow-origin");
    try {
      if (!response.ok) throw new Error("HTTP " + response.status);
      if (!response.body) throw new Error("Empty response body.");
      const reader = response.body.getReader();
      try {
        const { value } = await reader.read();
        const bytes = Buffer.from(value || []);
        const isMp4 = bytes.length >= 8 && bytes.toString("ascii", 4, 8) === "ftyp";
        const isHls = bytes.subarray(0, 64).toString("utf8").trimStart().startsWith("#EXTM3U");
        if (!isMp4 && !isHls) throw new Error("Response is not an MP4 header or HLS manifest.");
        return { status: response.status, contentType, corsOrigin, format: isMp4 ? "mp4" : "hls" };
      } finally {
        await reader.cancel();
      }
    } finally {
      if (!response.body?.locked) await response.body?.cancel();
    }
  } catch (error) {
    throw new Error("Media probe: " + error.message, { cause: error });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const probe = args.includes("--probe");
  const positional = args.filter(arg => arg !== "--probe");
  if (![1, 3].includes(positional.length) || positional.some(arg => !/^\d+$/.test(arg))) {
    throw new Error("Usage: node tools\\streamplay-resolver.mjs <tmdb-id> [season episode] [--probe]");
  }
  const [tmdbId, season, episode] = positional.map(Number);
  const result = await resolveVidlink({ tmdbId, season, episode });
  if (probe) {
    try {
      result.probe = await probeMedia(result.streams[0]);
    } catch (error) {
      result.probe = { error: error.message };
      process.exitCode = 1;
    }
  }
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
