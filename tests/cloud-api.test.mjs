import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { createApi, documentInput, HttpError, MAX_FILE_BYTES } from "../cloud/api.mjs";

const file = { name: "notes.md", raw: "# Notes", origin: "upload", theme: "default", closed: false, version: 0 };

function fixture() {
  const calls = [];
  const store = Object.fromEntries(["list", "read", "history", "save", "sessions", "addSession"].map(method => [
    method, async (...args) => { calls.push({ method, args }); return { items: [], next: null }; }
  ]));
  const errors = [];
  const api = createApi({
    store, origins: ["https://study.thestone.co.za", "https://xalebxen99.github.io"],
    verify: async token => token === "valid" ? "verified-owner" : null,
    logError: (...args) => errors.push(args)
  });
  const request = (path, { token = "valid", origin = "https://xalebxen99.github.io", method = "GET", body, headers = {} } = {}) => api.fetch(new Request("https://api.example/" + path, {
    method,
    headers: { ...(token ? { Authorization: "Bearer " + token } : {}), Origin: origin, ...(body ? { "Content-Type": "application/json" } : {}), ...headers },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body)
  }));
  return { request, calls, store, errors };
}

test("the cloud API rejects signed-out, invalid-token and untrusted-origin requests before data access", async () => {
  const { request, calls } = fixture();
  assert.equal((await request("documents", { token: null })).status, 401);
  assert.equal((await request("documents", { token: "invalid" })).status, 401);
  assert.equal((await request("documents", { origin: "https://attacker.example" })).status, 403);
  assert.equal(calls.length, 0);
});

test("CORS preflights allow only the app and loopback origins, without doing application work", async () => {
  const { request, calls } = fixture();
  for (const origin of ["https://study.thestone.co.za", "https://xalebxen99.github.io", "http://localhost:4173", "http://127.0.0.1:4174"]) {
    const response = await request("documents", { token: null, method: "OPTIONS", origin });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), origin);
    assert.match(response.headers.get("access-control-allow-headers"), /Authorization/);
  }
  assert.equal((await request("documents", { origin: "http://localhost.attacker.example:4173", method: "OPTIONS" })).status, 403);
  assert.equal(calls.length, 0);
});

test("document, revision and session operations always use the verified owner, never a body owner", async () => {
  const { request, calls } = fixture();
  const id = randomUUID();
  assert.equal((await request("documents/" + id, { method: "PUT", body: { ...file, ownerId: "attacker" } })).status, 200);
  assert.equal(calls[0].args[0], "verified-owner");
  assert.equal(calls[0].args[2].ownerId, undefined);
  await request("documents/" + id + "/revisions/2");
  assert.deepEqual(calls[1], { method: "read", args: ["verified-owner", id, 2] });
  await request("documents/" + id + "/revisions?before=3");
  assert.deepEqual(calls[2], { method: "history", args: ["verified-owner", id, 3] });
  await request("sessions");
  assert.equal(calls[3].args[0], "verified-owner");
});

test("Markdown validation checks the actual UTF-8 byte limit and rejects invalid metadata", () => {
  assert.equal(documentInput({ ...file, raw: "a".repeat(MAX_FILE_BYTES) }).raw.length, MAX_FILE_BYTES);
  for (const invalid of [
    { raw: "a".repeat(MAX_FILE_BYTES + 1) },
    { raw: "\u00e9".repeat(MAX_FILE_BYTES / 2 + 1) },
    { name: "../secret.md" }, { name: "file.txt" }, { raw: null },
    { version: -1 }, { version: 1.5 }, { closed: "false" }, { origin: "bundled" }
  ]) assert.throws(() => documentInput({ ...file, ...invalid }), error => error.status === 400);
});

test("malformed bodies, invalid cursors and routes produce explicit errors without store calls", async () => {
  const { request, calls } = fixture();
  const id = randomUUID();
  for (const path of ["documents/not-a-uuid", "documents?after=bad", "documents/" + id + "/revisions?before=bad", "documents/" + id + "/revisions/0", "sessions?before=not-a-date"]) {
    assert.equal((await request(path)).status, 400, path);
  }
  assert.equal((await request("documents/" + id, { method: "PUT", body: "{" })).status, 400);
  assert.equal((await request("documents/" + id, { method: "PUT", body: file, headers: { "Content-Type": "text/plain" } })).status, 415);
  assert.equal((await request("missing")).status, 404);
  assert.equal(calls.length, 0);
});

test("conflicts and ownership failures remain visible; internal errors are logged without leaking details", async () => {
  const { request, store, errors } = fixture();
  const id = randomUUID();
  store.read = async () => { throw new HttpError(404, "Document not found."); };
  assert.equal((await request("documents/" + id)).status, 404);
  store.save = async () => { throw new HttpError(409, "Changed on another device."); };
  const conflict = await request("documents/" + id, { method: "PUT", body: file });
  assert.equal(conflict.status, 409);
  assert.match((await conflict.json()).error, /another device/);
  store.list = async () => { throw new Error("database credentials must not be sent to a browser"); };
  const unavailable = await request("documents");
  assert.equal(unavailable.status, 500);
  assert.doesNotMatch((await unavailable.json()).error, /credentials/);
  assert.equal(errors.length, 1);
});

test("study history accepts completed timers, rejects invalid dates, and does not trust a supplied owner", async () => {
  const { request, calls } = fixture();
  const session = {
    id: randomUUID(), startedAt: new Date(Date.now() - 20000).toISOString(),
    finishedAt: new Date(Date.now() - 1000).toISOString(), durationMs: 10000, technique: "Pomodoro", ownerId: "someone-else"
  };
  assert.equal((await request("sessions", { method: "POST", body: session })).status, 200);
  assert.equal(calls[0].args[0], "verified-owner");
  assert.equal(calls[0].args[1].ownerId, undefined);
  for (const invalid of [{ durationMs: 0 }, { durationMs: 86400001 }, { startedAt: "bad" }, { finishedAt: new Date(Date.now() + 120000).toISOString() }, { startedAt: session.finishedAt }]) {
    assert.equal((await request("sessions", { method: "POST", body: { ...session, ...invalid } })).status, 400);
  }
});
