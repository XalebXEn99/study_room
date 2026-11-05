import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";

test("live Better Auth, private objects, revisions and study history survive new requests and isolate accounts", {
  skip: process.env.RUN_CLOUD_LIVE !== "1"
}, async () => {
  const authUrl = process.env.NEON_AUTH_BASE_URL;
  const apiUrl = process.env.NEON_FUNCTION_STUDYAPI_BASE_URL;
  assert.ok(authUrl && apiUrl, "Use a dedicated verification branch with Auth and the studyapi Function.");
  async function account() {
    const email = "study-test-" + randomUUID() + "@example.com";
    const password = randomUUID() + randomUUID();
    const response = await fetch(authUrl + "/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:4173" },
      body: JSON.stringify({ email, password, name: "Study verification" }),
      signal: AbortSignal.timeout(60000)
    });
    const data = await response.json();
    assert.ok(response.ok, "Test signup failed: " + (data.message || response.status));
    const cookie = response.headers.getSetCookie().map(item => item.split(";")[0]).join("; ");
    assert.ok(cookie, "Signup must establish a browser session.");
    const tokenResponse = await fetch(authUrl + "/token", {
      headers: { Cookie: cookie, Origin: "http://localhost:4173" },
      signal: AbortSignal.timeout(60000)
    });
    assert.equal(tokenResponse.status, 200, "The session must issue a short-lived JWT.");
    const jwt = (await tokenResponse.json()).token;
    assert.equal(typeof jwt, "string");
    const restored = await fetch(authUrl + "/get-session", { headers: { Cookie: cookie } });
    assert.equal((await restored.json()).user.id, data.user.id, "The session must survive a fresh request.");
    return { cookie, jwt, id: data.user.id, email, password };
  }
  const owner = await account();
  const other = await account();
  const request = (path, user = owner, method = "GET", body) => fetch(new URL(path, apiUrl), {
    method,
    headers: {
      Origin: "http://localhost:4173",
      ...(user ? { Authorization: "Bearer " + user.jwt } : {}),
      ...(body ? { "Content-Type": "application/json" } : {})
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(60000)
  });
  assert.equal((await request("documents", null)).status, 401);
  const id = randomUUID();
  const file = { name: "private.md", raw: "# Original", origin: "upload", theme: "default", closed: false, version: 0 };
  const created = await request("documents/" + id, owner, "PUT", file);
  assert.equal(created.status, 200, "The authenticated API must write to Postgres and the private bucket.");
  assert.equal((await created.json()).version, 1);
  const read = await (await request("documents/" + id)).json();
  assert.equal(read.raw, file.raw);
  assert.equal(read.version, 1);
  assert.equal((await request("documents/" + id, other)).status, 404);
  assert.equal((await request("documents/" + id + "/revisions", other)).status, 404);
  assert.equal((await request("documents/" + id, other, "PUT", file)).status, 404);
  assert.equal((await (await request("documents", other)).json()).items.length, 0);
  const edited = { ...file, raw: "# Edited", version: 1 };
  assert.equal((await (await request("documents/" + id, owner, "PUT", edited)).json()).version, 2);
  assert.equal((await (await request("documents/" + id, owner, "PUT", edited)).json()).version, 2,
    "A retry after a lost response must not duplicate a revision.");
  assert.equal((await request("documents/" + id, owner, "PUT", { ...file, raw: "# Conflicting", version: 1 })).status, 409);
  const versions = await (await request("documents/" + id + "/revisions")).json();
  assert.deepEqual(versions.items.map(item => item.version), [2, 1]);
  assert.equal((await (await request("documents/" + id + "/revisions/1")).json()).raw, "# Original");
  assert.equal((await (await request("documents/" + id)).json()).raw, "# Edited", "Revision reads must not replace the current document.");
  const session = {
    id: randomUUID(), startedAt: new Date(Date.now() - 15000).toISOString(),
    finishedAt: new Date(Date.now() - 1000).toISOString(), durationMs: 10000, technique: "Custom"
  };
  assert.equal((await request("sessions", owner, "POST", session)).status, 200);
  assert.equal((await request("sessions", owner, "POST", session)).status, 200);
  assert.equal((await (await request("sessions")).json()).items.length, 1, "Completion retries must be idempotent.");
  assert.equal((await (await request("sessions", other)).json()).items.length, 0);
  for (let offset = 0; offset < 55; offset += 5) {
    const responses = await Promise.all(Array.from({ length: 5 }, () =>
      request("sessions", owner, "POST", { ...session, id: randomUUID() })));
    responses.forEach(response => assert.equal(response.status, 200));
  }
  const firstPage = await (await request("sessions")).json();
  assert.equal(firstPage.items.length, 50);
  assert.ok(firstPage.next);
  const secondPage = await (await request("sessions?before=" + encodeURIComponent(firstPage.next))).json();
  assert.equal(secondPage.items.length, 6);
  assert.equal(secondPage.next, null);
  assert.equal(new Set([...firstPage.items, ...secondPage.items].map(item => item.id)).size, 56,
    "Equal completion timestamps must not skip or duplicate sessions between pages.");
  const signout = await fetch(authUrl + "/sign-out", {
    method: "POST",
    headers: { Cookie: owner.cookie, Origin: "http://localhost:4173", "Content-Type": "application/json" },
    body: "{}"
  });
  assert.equal(signout.status, 200);
  const ended = await fetch(authUrl + "/get-session", { headers: { Cookie: owner.cookie } });
  assert.equal(await ended.json(), null, "Sign-out must end the browser session.");
});
