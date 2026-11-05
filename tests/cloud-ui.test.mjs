import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";

const source = (await readFile(new URL("../cloud.js", import.meta.url), "utf8")).replace(/^import [^\n]+\n/gm, "");
const settle = () => new Promise(resolve => setImmediate(resolve));

async function fixture() {
  const nodes = new Map();
  const storage = new Map();
  const errors = [];
  const state = { user: null, failure: null, workspaces: [] };
  function node(id) {
    if (nodes.has(id)) return nodes.get(id);
    const listeners = new Map();
    const classes = new Set();
    const item = {
      id, value: "", textContent: "", hidden: false, disabled: false, open: false, attributes: {}, children: [],
      classList: {
        contains: name => classes.has(name),
        toggle(name, force) { if (force) classes.add(name); else classes.delete(name); }
      },
      addEventListener(name, callback) {
        if (!listeners.has(name)) listeners.set(name, []);
        listeners.get(name).push(callback);
      },
      async emit(name, event = {}) {
        for (const callback of listeners.get(name) || []) await callback(event);
      },
      setAttribute(name, value) { this.attributes[name] = value; },
      showModal() { this.open = true; },
      close() { this.open = false; void this.emit("close"); },
      focus() { state.focus = this.id; },
      getBoundingClientRect() { return { left: 20, right: 520, top: 50, bottom: 550 }; },
      reportValidity() { return true; },
      replaceChildren(...children) { this.children = children; },
      append(child) { this.children.push(child); }
    };
    nodes.set(id, item);
    return item;
  }
  async function signIn(credentials) {
    if (state.failure) return { error: { message: state.failure } };
    state.user = { id: "test-owner", email: credentials.email };
    return { data: { user: state.user } };
  }
  const auth = {
    getSession: async () => ({ data: state.user ? { user: state.user } : null }),
    signIn: { email: signIn, emailOtp: signIn },
    signUp: { email: signIn },
    signOut: async () => { state.user = null; return { data: {} }; },
    emailOtp: { sendVerificationOtp: async () => ({ data: {} }) },
    token: async () => ({ data: { token: "test.jwt.signature" } })
  };
  const workspace = { ready: false, load: async () => { workspace.ready = true; }, flush: async () => {}, stop() {} };
  const controls = ["account-email", "account-password", "account-name", "account-code", "account-submit",
    "account-mode", "account-send-code", "account-verify-code", "account-signout", "cloud-import", "cloud-import-tab", "cloud-retry"];
  const context = {
    document: {
      getElementById: node,
      querySelectorAll: () => controls.map(node),
      createElement: name => node(name + "-" + nodes.size)
    },
    window: {
      studyRoomCloudConfigured: true,
      studyRoomCloudConfig: { authUrl: "https://auth.example.test", apiUrl: "https://api.example.test/" },
      studyRoomDocuments: {
        snapshot: () => [],
        replaceWorkspace: entries => state.workspaces.push(entries),
        active: () => null
      },
      addEventListener: (name, callback) => node("window").addEventListener(name, callback),
      dispatchEvent: event => node("window").emit(event.type),
      confirm: () => true
    },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key)
    },
    createAuthClient: () => auth,
    createWorkspaceSync: () => workspace,
    readRecovery: () => [],
    fetch: async () => ({ ok: true, json: async () => ({ items: [], next: null }) }),
    console: { error: (...args) => errors.push(args) },
    URL, Event, AbortSignal
  };
  runInNewContext(source, context, { filename: "cloud.js" });
  await settle();
  return {
    node, state, errors,
    async emit(id, name = "click", event = {}) {
      await node(id).emit(name, event);
      await settle();
    }
  };
}

test("Profile is alongside Settings and Theme, and the account form is only in a native modal", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const toolbar = html.match(/<div class="top-bar-right">([\s\S]*?)<div class="theme-dropdown">/)[1];
  assert.match(toolbar, /id="settings-btn"/);
  assert.match(toolbar, /id="profile-btn"[^>]+aria-controls="account-dialog"/);
  const dialog = html.match(/<dialog id="account-dialog"[^>]*>([\s\S]*?)<\/dialog>/)[1];
  assert.match(dialog, /id="account-form"/);
  assert.doesNotMatch(html.split('<main class="app-wrapper">')[0], /id="account-form"/);
});

test("Profile opens on demand, closes from the backdrop, clears credentials, and returns focus", async () => {
  const ui = await fixture();
  const dialog = ui.node("account-dialog");
  assert.equal(dialog.open, false);
  await ui.emit("profile-btn");
  assert.equal(dialog.open, true);
  assert.equal(ui.state.focus, "account-email");
  await ui.emit("account-dialog", "click", { target: dialog, clientX: 100, clientY: 100 });
  assert.equal(dialog.open, true);
  ui.node("account-password").value = "synthetic-password";
  ui.node("account-code").value = "123456";
  await ui.emit("account-dialog", "click", { target: dialog, clientX: 0, clientY: 0 });
  assert.equal(dialog.open, false);
  assert.equal(ui.node("account-password").value, "");
  assert.equal(ui.node("account-code").value, "");
  assert.equal(ui.state.focus, "profile-btn");
  await ui.emit("profile-btn");
  let prevented = false;
  await ui.emit("account-dialog", "keydown", { key: "Escape", preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(dialog.open, false);
  assert.equal(ui.state.focus, "profile-btn");
});

test("password sign-in closes Profile and sign-out keeps the same private workspace behavior", async () => {
  const ui = await fixture();
  await ui.emit("profile-btn");
  ui.node("account-email").value = "reader@example.test";
  ui.node("account-password").value = "synthetic-password";
  await ui.emit("account-form", "submit", { preventDefault() {} });
  assert.equal(ui.node("account-dialog").open, false);
  assert.equal(ui.node("account-form").hidden, true);
  assert.equal(ui.node("profile-btn").attributes["aria-label"], "Profile: reader@example.test");
  await ui.emit("profile-btn");
  assert.equal(ui.state.focus, "account-signout");
  await ui.emit("account-signout");
  assert.equal(ui.node("account-form").hidden, false);
  assert.equal(ui.node("cloud-history").hidden, true);
  assert.equal(ui.state.workspaces.length, 1);
  assert.equal(ui.state.workspaces[0].length, 0);
});

test("authentication errors stay visible inside Profile and in the sidebar without closing the modal", async () => {
  const ui = await fixture();
  ui.state.failure = "Invalid test credentials";
  await ui.emit("profile-btn");
  await ui.emit("account-form", "submit", { preventDefault() {} });
  assert.equal(ui.node("account-dialog").open, true);
  assert.equal(ui.node("account-status").textContent, "Invalid test credentials");
  assert.equal(ui.node("cloud-status").textContent, "Invalid test credentials");
  assert.equal(ui.node("account-status").classList.contains("error"), true);
  assert.equal(ui.node("account-submit").disabled, false);
  assert.equal(ui.errors.length, 1);
});

test("email-code login remains in Profile and closes the modal after successful verification", async () => {
  const ui = await fixture();
  await ui.emit("profile-btn");
  ui.node("account-email").value = "reader@example.test";
  await ui.emit("account-send-code");
  assert.equal(ui.node("account-code-fields").hidden, false);
  assert.equal(ui.state.focus, "account-code");
  ui.node("account-code").value = "123456";
  await ui.emit("account-verify-code");
  assert.equal(ui.node("account-dialog").open, false);
  assert.equal(ui.node("account-code").value, "");
  assert.equal(ui.node("account-form").hidden, true);
});
