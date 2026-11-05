import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { createWorkspaceSync } from "../cloud-sync.js";

function fixture(t, { remote = [], storage = new Map(), ownerId = "owner-a", apiOverride } = {}) {
  let workspace = [];
  const values = new Map(remote.map(file => [file.id, { ...file }]));
  const requests = [];
  const statuses = [];
  const documents = {
    snapshot: () => workspace.map(file => ({ ...file })),
    acknowledge(id, version) {
      const entry = workspace.find(file => file.cloudId === id);
      if (entry) entry.version = version;
    },
    replaceWorkspace(entries) {
      workspace = entries.map((entry, index) => ({ ...entry, id: index + 1, cloudId: entry.id }));
    }
  };
  const sync = createWorkspaceSync({
    ownerId, documents, delay: 60000,
    storage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key)
    },
    onStatus: (text, error = false) => statuses.push({ text, error }),
    api: async (path, options) => {
      requests.push({ path, options });
      if (apiOverride) return apiOverride(path, options);
      if (path === "documents") return { items: [...values.values()].map(({ id }) => ({ id })), next: null };
      const id = path.slice("documents/".length);
      if (!options) return { ...values.get(id) };
      const version = (values.get(id)?.version || 0) + 1;
      values.set(id, { ...options.body, id, version });
      return { id, version };
    }
  });
  t.after(() => sync.stop());
  return {
    sync, storage, requests, statuses, values, documents,
    get workspace() { return workspace; },
    add(raw = "# New") {
      const entry = {
        id: workspace.length + 1, cloudId: randomUUID(), version: 0,
        name: "notes.md", raw, origin: "created", theme: "default", closed: false
      };
      workspace.push(entry);
      return entry;
    }
  };
}
const file = () => ({
  id: randomUUID(), version: 1, name: "saved.md", raw: "# Saved",
  origin: "upload", theme: "default", closed: false
});

test("loading private files does not upload them again, and an empty flush does not disable future saves", async t => {
  const remote = file();
  const ui = fixture(t, { remote: [remote] });
  await ui.sync.load();
  await ui.sync.flush();
  assert.equal(ui.sync.dirty, false);
  assert.equal(ui.requests.filter(item => item.options).length, 0);
  ui.workspace[0].raw = "# Edited";
  ui.sync.observe();
  await ui.sync.flush();
  assert.equal(ui.values.get(remote.id).raw, "# Edited");
  assert.equal(ui.workspace[0].version, 2);
  assert.equal(ui.sync.dirty, false);
  assert.equal(ui.storage.has("study-room-cloud-drafts:owner-a"), false);
  ui.workspace[0].raw = "# Edited again";
  await ui.sync.flush();
  assert.equal(ui.values.get(remote.id).version, 3);
});

test("edits made while a write is in flight are saved after that write using the acknowledged version", async t => {
  const writes = [];
  let release;
  let first = true;
  const ui = fixture(t, {
    apiOverride: async (path, options) => {
      if (!options) return { items: [], next: null };
      writes.push({ ...options.body });
      if (first) {
        first = false;
        await new Promise(resolve => { release = resolve; });
      }
      return { version: options.body.version + 1 };
    }
  });
  await ui.sync.load();
  const draft = ui.add("# First");
  ui.sync.observe();
  const saving = ui.sync.flush();
  draft.raw = "# Second";
  ui.sync.observe();
  release();
  await saving;
  assert.deepEqual(writes.map(item => [item.raw, item.version]), [["# First", 0], ["# Second", 1]]);
  assert.equal(ui.sync.dirty, false);
});

test("failed saves retain account-scoped recovery content and retries persist it without losing identity", async t => {
  const storage = new Map();
  const ui = fixture(t, {
    storage,
    apiOverride: async (path, options) => {
      if (!options) return { items: [], next: null };
      throw new Error("Offline");
    }
  });
  await ui.sync.load();
  const draft = ui.add();
  ui.sync.observe();
  await assert.rejects(ui.sync.flush(), /Offline/);
  assert.equal(ui.sync.dirty, true);
  assert.match(ui.statuses.at(-1).text, /Pending edits/);
  assert.equal(ui.statuses.at(-1).error, true);
  const cached = JSON.parse(storage.get("study-room-cloud-drafts:owner-a"));
  assert.equal(cached[0].id, draft.cloudId);
  const other = fixture(t, { storage, ownerId: "owner-b" });
  await other.sync.load();
  assert.equal(other.workspace.length, 0, "A different account must not load this recovery cache.");
  const restored = fixture(t, { storage });
  await restored.sync.load();
  assert.equal(restored.workspace[0].raw, "# New");
  assert.equal(restored.workspace[0].cloudId, draft.cloudId);
  assert.equal(restored.workspace[0].version, 1);
  assert.equal(storage.has("study-room-cloud-drafts:owner-a"), false);
});

test("unreadable recovery data is not overwritten or replaced with a blank workspace", async t => {
  for (const raw of ["{broken", JSON.stringify([{ id: "invalid" }])]) {
    const storage = new Map([["study-room-cloud-drafts:owner-a", raw]]);
    const ui = fixture(t, { storage });
    await assert.rejects(ui.sync.load());
    ui.sync.observe();
    assert.equal(storage.get("study-room-cloud-drafts:owner-a"), raw);
    assert.equal(ui.sync.ready, false);
  }
});

test("legacy import is explicit, deduplicates retry content, and leaves original browser data intact", async t => {
  const storage = new Map([["md-files", "original backup"]]);
  const ui = fixture(t, { storage });
  await ui.sync.load();
  const input = [{ name: "legacy.md", raw: "# Legacy", theme: "sepia" }];
  await ui.sync.import(input);
  await ui.sync.import(input);
  assert.equal(ui.workspace.length, 1);
  assert.equal(ui.workspace[0].raw, "# Legacy");
  assert.equal(ui.workspace[0].theme, "sepia");
  assert.equal(ui.workspace[0].version, 1);
  assert.equal(storage.get("md-files"), "original backup");
});

test("a stopped workspace never schedules writes for another account", async t => {
  const ui = fixture(t);
  await ui.sync.load();
  ui.add();
  ui.sync.stop();
  ui.sync.observe();
  await assert.rejects(ui.sync.flush(), /not finished loading/);
  assert.equal(ui.requests.filter(item => item.options).length, 0);
});
