export const MAX_FILE_BYTES = 5 * 1024 * 1024;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function documentInput(value) {
  if (!value || typeof value !== "object" || typeof value.name !== "string" ||
      !/^[^\\/:*?"<>|\x00-\x1f]{1,160}\.(md|markdown|mdown|mkd)$/i.test(value.name) ||
      typeof value.raw !== "string" || new TextEncoder().encode(value.raw).length > MAX_FILE_BYTES ||
      !["upload", "created"].includes(value.origin) || typeof value.theme !== "string" ||
      value.theme.length > 64 || typeof value.closed !== "boolean" ||
      !Number.isSafeInteger(value.version) || value.version < 0) {
    throw new HttpError(400, "Provide a Markdown filename, content up to 5 MB, and a valid document version.");
  }
  return {
    name: value.name, raw: value.raw, origin: value.origin,
    theme: value.theme, closed: value.closed, version: value.version
  };
}

async function readJson(request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    throw new HttpError(415, "Send application/json.");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "A JSON body is required.");
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      // JSON can encode one content byte as a six-byte escape.
      if (size > MAX_FILE_BYTES * 6 + 4096) throw new HttpError(413, "Request exceeds the 5 MB document limit.");
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "The request body is not valid JSON.");
  }
}

function sessionInput(value) {
  if (!value || !UUID.test(value.id) || !Number.isInteger(value.durationMs) ||
      value.durationMs < 1000 || value.durationMs > 24 * 60 * 60 * 1000 ||
      typeof value.technique !== "string" || value.technique.length > 100 ||
      typeof value.startedAt !== "string" || typeof value.finishedAt !== "string") {
    throw new HttpError(400, "Provide a valid completed study session.");
  }
  const startedAt = new Date(value.startedAt);
  const finishedAt = new Date(value.finishedAt);
  if (!Number.isFinite(+startedAt) || !Number.isFinite(+finishedAt) ||
      finishedAt < startedAt || +finishedAt > Date.now() + 60000 ||
      +finishedAt - +startedAt < value.durationMs - 1000) {
    throw new HttpError(400, "Study session dates do not match its duration.");
  }
  return { id: value.id, durationMs: value.durationMs, technique: value.technique, startedAt, finishedAt };
}

export function createApi({ store, verify, origins, logError = console.error }) {
  return {
    async fetch(request) {
      const origin = request.headers.get("origin");
      const allowed = !origin || origins.includes(origin) ||
        /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/.test(origin);
      const headers = {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        Vary: "Origin",
        ...(origin && allowed ? {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
          "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS"
        } : {})
      };
      const json = (value, status = 200) => Response.json(value, { status, headers });
      try {
        if (!allowed) throw new HttpError(403, "This website is not allowed to use the study backend.");
        if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
        const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
        if (!token) throw new HttpError(401, "Sign in to access your study files.");
        const ownerId = await verify(token);
        if (!ownerId) throw new HttpError(401, "Your session expired. Sign in again.");
        const url = new URL(request.url);
        const path = url.pathname.replace(/\/$/, "") || "/";
        if (path === "/" && request.method === "GET") return json({ service: "Study Room", authenticated: true });
        if (path === "/documents" && request.method === "GET") {
          const after = url.searchParams.get("after");
          if (after && !UUID.test(after)) throw new HttpError(400, "Invalid document cursor.");
          return json(await store.list(ownerId, after));
        }
        const match = path.match(/^\/documents\/([^/]+)(?:\/revisions(?:\/(\d+))?)?$/);
        if (match) {
          const [, id, revision] = match;
          if (!UUID.test(id)) throw new HttpError(400, "Invalid document ID.");
          if (request.method === "GET") {
            if (path.endsWith("/revisions")) {
              const before = url.searchParams.get("before");
              if (before && (!/^\d+$/.test(before) || !Number.isSafeInteger(Number(before)))) {
                throw new HttpError(400, "Invalid revision cursor.");
              }
              return json(await store.history(ownerId, id, before ? Number(before) : null));
            }
            if (revision && (!Number.isSafeInteger(Number(revision)) || Number(revision) < 1)) {
              throw new HttpError(400, "Invalid revision.");
            }
            return json(await store.read(ownerId, id, revision ? Number(revision) : null));
          }
          if (request.method === "PUT" && !path.includes("/revisions")) {
            return json(await store.save(ownerId, id, documentInput(await readJson(request))));
          }
        }
        if (path === "/sessions" && request.method === "GET") {
          const before = url.searchParams.get("before");
          const parts = before?.split(",");
          if (before && (parts.length !== 2 || !Number.isFinite(Date.parse(parts[0])) || !UUID.test(parts[1]))) {
            throw new HttpError(400, "Invalid history cursor.");
          }
          return json(await store.sessions(ownerId, before ? { finishedAt: new Date(parts[0]), id: parts[1] } : null));
        }
        if (path === "/sessions" && request.method === "POST") {
          await store.addSession(ownerId, sessionInput(await readJson(request)));
          return json({ saved: true });
        }
        throw new HttpError(404, "Study endpoint not found.");
      } catch (error) {
        const status = error instanceof HttpError ? error.status : 500;
        if (status >= 500) logError("Study cloud request failed:", error);
        return json({ error: status < 500 ? error.message : "Cloud storage is unavailable. Your changes have not been confirmed saved. Retry shortly." }, status);
      }
    }
  };
}
