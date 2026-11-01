import { createServer } from "node:http";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { resolveVidlink } from "./streamplay-resolver.mjs";
import { publicFetch, validatePublicUrl } from "./public-fetch.mjs";
import { STUDY_NOTES } from "../study-data.js";
import { MOTIVATION_QUOTES } from "../motivation-data.js";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const FILES = new Map([
  ["/", ["index.html", "text/html"]],
  ...["app.js", "spotify.js", "youtube.js", "library.js", "study-data.js", "timer.js", "timer-state.js", "motivation.js", "motivation-data.js"].map(name => ["/" + name, [name, "text/javascript"]]),
  ...STUDY_NOTES.map(note => ["/" + note.url, [note.url, "text/markdown; charset=utf-8"]]),
  ...MOTIVATION_QUOTES.map(quote => ["/" + quote.audio, [quote.audio, "audio/mpeg"]]),
  ["/style.css", ["style.css", "text/css"]],
  ["/graphic-design.css", ["graphic-design.css", "text/css"]],
  ["/hls.min.js", ["node_modules\\hls.js\\dist\\hls.min.js", "text/javascript"]]
]);
const SINTEL = {
  id: 45745, type: "movie", title: "Sintel", year: "2010",
  thumbnail: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg"
};
const MAX_MANIFEST_BYTES = 2 * 1024 * 1024;
const MAX_TICKETS = 1000;
const TICKET_TTL = 15 * 60 * 1000;

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function positive(value, name, allowZero = false) {
  if (value === null || !/^\d+$/.test(value) ||
      !Number.isSafeInteger(Number(value)) || Number(value) < (allowZero ? 0 : 1)) {
    throw new HttpError(400, "Invalid " + name + ".");
  }
  return Number(value);
}

function selection(params) {
  const type = params.get("type");
  if (!["movie", "tv"].includes(type)) throw new HttpError(400, "Select a movie or TV series.");
  return { type, id: positive(params.get("id"), "TMDB ID") };
}

function sendJson(res, status, value) {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(value));
}

function title(item) {
  return {
    id: item.id, type: item.media_type,
    title: item.title || item.name,
    year: (item.release_date || item.first_air_date || "").slice(0, 4),
    thumbnail: item.poster_path ? "https://image.tmdb.org/t/p/w342" + item.poster_path : null
  };
}

async function boundedText(response, limit) {
  if (!response.body) throw new Error("Upstream returned no response body.");
  const reader = response.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > limit) throw new Error("Upstream response exceeds size limit.");
      chunks.push(Buffer.from(value));
    }
    return Buffer.concat(chunks).toString("utf8");
  } finally { await reader.cancel(); }
}

export function createBridge({
  tmdbToken = process.env.TMDB_READ_TOKEN || "",
  publicUrl = process.env.BRIDGE_PUBLIC_URL || "",
  bridgeToken = process.env.BRIDGE_TOKEN || "",
  frontendOrigin = process.env.FRONTEND_ORIGIN || "https://xalebxen99.github.io",
  fetchImpl = publicFetch,
  resolveImpl = resolveVidlink
} = {}) {
  const tickets = new Map();
  let resolving = false;
  const external = publicUrl ? new URL(publicUrl) : null;
  if (external && (external.protocol !== "https:" || external.pathname !== "/" || external.search ||
      external.hash || external.username || external.password)) throw new Error("BRIDGE_PUBLIC_URL must be an HTTPS origin.");
  if (external && bridgeToken.length < 32) throw new Error("Public bridges require BRIDGE_TOKEN of at least 32 characters.");
  if (new URL(frontendOrigin).origin !== frontendOrigin) throw new Error("FRONTEND_ORIGIN must be an origin without a path.");

  function authorized(value) {
    const hash = text => createHash("sha256").update(text).digest();
    return timingSafeEqual(hash(value || ""), hash("Bearer " + bridgeToken));
  }

  function ticketFor(url, headers) {
    validatePublicUrl(url);
    const now = Date.now();
    for (const [key, entry] of tickets) if (entry.expires <= now) tickets.delete(key);
    const safeHeaders = Object.fromEntries(Object.entries(headers || {})
      .filter(([name]) => ["user-agent", "accept", "accept-ranges", "referer", "origin"].includes(name.toLowerCase())));
    for (const [key, entry] of tickets) {
      if (entry.url === url && JSON.stringify(entry.headers) === JSON.stringify(safeHeaders)) return "/api/media/" + key;
    }
    if (tickets.size >= MAX_TICKETS) throw new HttpError(503, "Media session limit reached. Try again later.");
    const key = randomBytes(24).toString("hex");
    tickets.set(key, { url, headers: safeHeaders, expires: now + TICKET_TTL });
    return "/api/media/" + key;
  }

  async function tmdb(path, signal) {
    if (!tmdbToken) throw new HttpError(503, "Full search needs TMDB_READ_TOKEN on the bridge. You can try Sintel without a token.");
    const response = await fetchImpl("https://api.themoviedb.org/3" + path, {
      headers: { Authorization: "Bearer " + tmdbToken, Accept: "application/json" }, signal
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new HttpError(502, "TMDB returned HTTP " + response.status + ". Check the bridge token.");
    }
    return JSON.parse(await boundedText(response, MAX_MANIFEST_BYTES));
  }

  async function media(req, res, key, signal) {
    const entry = tickets.get(key);
    if (!entry || entry.expires <= Date.now()) {
      tickets.delete(key);
      throw new HttpError(410, "Stream session expired. Resolve this title again.");
    }
    entry.expires = Date.now() + TICKET_TTL;
    const range = req.headers.range;
    if (range && !/^bytes=(?:\d+-\d*|-\d+)$/.test(range)) throw new HttpError(416, "Only a single byte range is supported.");
    const response = await fetchImpl(entry.url, {
      headers: { ...entry.headers, ...(range ? { Range: range } : {}) }, signal
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new HttpError(502, "Media source returned HTTP " + response.status + ". Try another link.");
    }
    const contentType = response.headers.get("content-type") || "";
    const isHls = /mpegurl/i.test(contentType) || new URL(entry.url).pathname.endsWith(".m3u8");
    if (isHls) {
      const text = await boundedText(response, MAX_MANIFEST_BYTES);
      if (!text.trimStart().startsWith("#EXTM3U")) throw new HttpError(502, "Source did not return an HLS playlist.");
      const rewrite = uri => ticketFor(new URL(uri, response.url || entry.url).href, entry.headers);
      const manifest = text.split(/\r?\n/).map(line => {
        if (!line.trim()) return line;
        if (!line.startsWith("#")) return rewrite(line.trim());
        return line.replace(/URI="([^"]+)"/g, (_, uri) => 'URI="' + rewrite(uri) + '"');
      }).join("\n");
      res.writeHead(200, { "Content-Type": "application/vnd.apple.mpegurl", "Cache-Control": "no-store" });
      res.end(manifest);
      return;
    }
    if (/text\/html|application\/json/i.test(contentType)) {
      await response.body?.cancel();
      throw new HttpError(502, "Media source returned a challenge or error, not video.");
    }
    const headers = { "Cache-Control": "no-store" };
    for (const name of ["content-type", "content-length", "content-range", "accept-ranges"]) {
      const value = response.headers.get(name);
      if (value) headers[name] = value;
    }
    if (!response.body) throw new HttpError(502, "Media source returned an empty body.");
    res.writeHead(response.status, headers);
    if (req.method === "HEAD") {
      await response.body.cancel();
      res.end();
    } else {
      await pipeline(Readable.fromWeb(response.body), res);
    }
  }

  const server = createServer(async (req, res) => {
    const localOrigin = "http://127.0.0.1:" + server.address().port;
    const origin = external ? external.origin : localOrigin;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);
    res.on("close", () => { clearTimeout(timeout); controller.abort(); });
    try {
      const requestOrigin = req.headers.origin;
      const localPairing = !external && bridgeToken.length >= 32;
      const allowedOrigin = requestOrigin === origin || ((external || localPairing) && requestOrigin === frontendOrigin);
      if (![new URL(origin).host, new URL(localOrigin).host].includes(req.headers.host) ||
          (requestOrigin && !allowedOrigin) ||
          (!external && !localPairing && req.headers["sec-fetch-site"] && !["same-origin", "none"].includes(req.headers["sec-fetch-site"]))) {
        throw new HttpError(403, "Use the bridge from " + origin + ".");
      }
      if (allowedOrigin) {
        res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        res.setHeader("Vary", "Origin");
        res.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges");
        if (!external && req.headers["access-control-request-private-network"] === "true") {
          res.setHeader("Access-Control-Allow-Private-Network", "true");
        }
      }
      if (req.method === "OPTIONS") {
        if (!allowedOrigin) throw new HttpError(403, "Origin not allowed.");
        const method = req.headers["access-control-request-method"];
        const headers = (req.headers["access-control-request-headers"] || "").toLowerCase().split(",").map(value => value.trim()).filter(Boolean);
        if (!["GET", "HEAD"].includes(method) || headers.some(name => !["authorization", "range"].includes(name))) {
          throw new HttpError(403, "Preflight request not allowed.");
        }
        res.writeHead(204, {
          "Access-Control-Allow-Methods": "GET, HEAD",
          "Access-Control-Allow-Headers": "Authorization, Range",
          "Access-Control-Max-Age": "600"
        });
        return res.end();
      }
      if (!["GET", "HEAD"].includes(req.method)) throw new HttpError(405, "Method not supported.");
      const url = new URL(req.url, origin);
      if (url.pathname.startsWith("/api/") && !url.pathname.startsWith("/api/media/") &&
          (external || localPairing) && !authorized(req.headers.authorization)) throw new HttpError(401, "Bridge access token missing or invalid.");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Referrer-Policy", "no-referrer");
      if (url.pathname === "/api/status") return sendJson(res, 200, { searchConfigured: !!tmdbToken, provider: "vidlink" });
      if (url.pathname === "/api/demo") return sendJson(res, 200, SINTEL);
      if (url.pathname === "/api/search") {
        const query = (url.searchParams.get("q") || "").trim();
        if (!query || query.length > 200) throw new HttpError(400, "Enter a search of 1-200 characters.");
        const data = await tmdb("/search/multi?include_adult=false&query=" + encodeURIComponent(query), controller.signal);
        return sendJson(res, 200, {
          results: data.results.filter(item => ["movie", "tv"].includes(item.media_type)).map(title),
          attribution: "This product uses the TMDB API but is not endorsed or certified by TMDB."
        });
      }
      if (url.pathname === "/api/details") {
        const { type, id } = selection(url.searchParams);
        if (type !== "tv") throw new HttpError(400, "Episode browsing is for TV series.");
        const season = url.searchParams.get("season");
        const path = "/tv/" + id + (season === null ? "" : "/season/" + positive(season, "season", true));
        const data = await tmdb(path, controller.signal);
        return sendJson(res, 200, season === null ? {
          seasons: data.seasons.filter(item => item.episode_count > 0).map(item => ({ number: item.season_number, name: item.name }))
        } : {
          episodes: data.episodes.map(item => ({ number: item.episode_number, name: item.name }))
        });
      }
      if (url.pathname === "/api/resolve") {
        if (resolving) throw new HttpError(429, "Another title is resolving. Try again shortly.");
        const { type, id } = selection(url.searchParams);
        const selected = type === "tv" ? {
          season: positive(url.searchParams.get("season"), "season", true),
          episode: positive(url.searchParams.get("episode"), "episode")
        } : {};
        resolving = true;
        try {
          const result = await resolveImpl({ tmdbId: id, ...selected }, { fetchImpl });
          return sendJson(res, 200, {
            provider: result.provider,
            streams: result.streams.map(item => ({
              quality: item.quality, type: item.type, url: ticketFor(item.url, item.headers)
            })),
            subtitles: result.subtitles.map(item => ({
              language: item.language, type: item.type, url: ticketFor(item.url, {})
            }))
          });
        } finally { resolving = false; }
      }
      if (url.pathname.startsWith("/api/media/")) {
        clearTimeout(timeout);
        return await media(req, res, url.pathname.slice("/api/media/".length), controller.signal);
      }
      const file = FILES.get(url.pathname);
      if (!file) throw new HttpError(404, "Not found.");
      let contents;
      try { contents = await readFile(join(ROOT, ...file[0].split(/[\\/]/))); }
      catch (error) {
        if (error.code !== "ENOENT") throw error;
        throw new HttpError(404, "Asset missing. Run npm install for HLS playback.");
      }
      res.writeHead(200, { "Content-Type": file[1], "Cache-Control": "no-cache" });
      res.end(req.method === "HEAD" ? undefined : contents);
    } catch (error) {
      if (controller.signal.aborted && res.destroyed) return;
      const status = error instanceof HttpError ? error.status : 502;
      console.error("Bridge request failed:", status, error.message);
      if (res.headersSent) res.destroy();
      else sendJson(res, status, { error: error.message });
    } finally { clearTimeout(timeout); }
  });
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be between 1 and 65535.");
  const server = createBridge();
  server.on("error", error => { console.error("Bridge startup failed:", error.message); process.exitCode = 1; });
  const host = process.env.BRIDGE_PUBLIC_URL ? "0.0.0.0" : "127.0.0.1";
  server.listen(port, host, () => console.log("Study Room bridge listening on port " + port));
}
