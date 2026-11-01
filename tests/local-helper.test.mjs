import assert from "node:assert/strict";
import test from "node:test";
import { LIVE_PAGE, pairingUrl, startHelper } from "../tools/start-local-helper.mjs";

test("pairing URL keeps the live page and puts secrets only in the fragment", () => {
  const url = new URL(pairingUrl(12345, "a".repeat(64)));
  assert.equal(url.origin + url.pathname, LIVE_PAGE);
  assert.equal(url.search, "");
  const params = new URLSearchParams(url.hash.slice(1));
  assert.equal(params.get("study-room-helper"), "http://127.0.0.1:12345");
  assert.equal(params.get("token"), "a".repeat(64));
});

test("local helper binds loopback and authenticates live-page requests", async t => {
  const { server, token, url } = await startHelper();
  t.after(() => new Promise(resolve => {
    server.closeAllConnections();
    server.close(resolve);
  }));
  assert.equal(server.address().address, "127.0.0.1");
  const base = "http://127.0.0.1:" + server.address().port;
  assert.equal(new URLSearchParams(new URL(url).hash.slice(1)).get("token"), token);
  const origin = new URL(LIVE_PAGE).origin;
  const preflight = await fetch(base + "/api/status", {
    method: "OPTIONS",
    headers: {
      Origin: origin,
      "Access-Control-Request-Method": "GET",
      "Access-Control-Request-Headers": "authorization",
      "Access-Control-Request-Private-Network": "true"
    }
  });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), origin);
  assert.equal(preflight.headers.get("access-control-allow-private-network"), "true");
  const missing = await fetch(base + "/api/status", { headers: { Origin: origin } });
  assert.equal(missing.status, 401);
  const headers = { Origin: origin, Authorization: "Bearer " + token, "Sec-Fetch-Site": "cross-site" };
  const response = await fetch(base + "/api/status", { headers });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).provider, "vidlink");
  assert.equal((await fetch(base + "/api/status", {
    headers: { ...headers, Origin: "https://untrusted.example" }
  })).status, 403);
});
