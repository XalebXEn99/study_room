import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { STUDY_NOTES, BOOK_DOWNLOAD, YOUTUBE_COLLECTION, SPOTIFY_COLLECTION } from "../study-data.js";

const appSource = await readFile(new URL("../app.js", import.meta.url), "utf8");
const librarySource = (await readFile(new URL("../library.js", import.meta.url), "utf8")).replace(/^import [^\n]+\n/, "");

function fixture(saved = {}, { library = false, storageFailure = false } = {}) {
  const nodes = new Map();
  const storage = new Map(Object.entries(saved));
  const errors = [];
  const timers = [];
  const downloads = [];
  function element(id) {
    if (nodes.has(id)) return nodes.get(id);
    const classes = new Set();
    const listeners = new Map();
    const node = {
      id, textContent: "", value: "", dataset: {}, attributes: {}, children: [], hidden: false, style: {},
      classList: {
        add: (...names) => names.forEach(name => classes.add(name)),
        remove: (...names) => names.forEach(name => classes.delete(name)),
        contains: name => classes.has(name),
        toggle(name, force) {
          if (force ?? !classes.has(name)) classes.add(name);
          else classes.delete(name);
        }
      },
      set className(value) { classes.clear(); value.split(" ").forEach(name => classes.add(name)); },
      get className() { return [...classes].join(" "); },
      set innerHTML(value) { this.html = value; this.children = []; },
      get innerHTML() { return this.html || ""; },
      setAttribute(name, value) { this.attributes[name] = value; },
      getAttribute(name) { return this.attributes[name]; },
      addEventListener(name, callback) {
        if (!listeners.has(name)) listeners.set(name, []);
        listeners.get(name).push(callback);
      },
      async emit(name, event = {}) {
        for (const callback of listeners.get(name) || []) await callback.call(this, event);
      },
      dispatchEvent(event) { void this.emit(event.type, event); },
      append(...children) { this.children.push(...children); },
      appendChild(child) { this.append(child); },
      replaceChildren(...children) { this.children = children; },
      querySelectorAll() { return []; },
      contains(node) { return this === node || this.children.some(child => child.contains?.(node)); },
      focus() { document.activeElement = this; },
      select() {},
      setCustomValidity(value) { this.validityMessage = value; },
      reportValidity() { this.validityReported = true; },
      click() { if (id === "a") downloads.push({ name: this.download, href: this.href }); void this.emit("click"); },
      remove() {}
    };
    nodes.set(id, node);
    return node;
  }
  let created = 0;
  const document = element("document");
  document.body = element("body");
  document.getElementById = element;
  document.querySelector = element;
  document.createElement = tag => element(tag === "a" ? tag : tag + "-" + ++created);
  document.createElementNS = (_, tag) => document.createElement(tag);
  document.createTextNode = text => ({ textContent: text });
  const window = element("window");
  const context = {
    document, window, Event, Blob,
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem(key, value) {
        if (storageFailure) throw new Error("Storage is full");
        storage.set(key, value);
      }
    },
    console: { error: (...args) => errors.push(args) },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    marked: { setOptions() {}, parse: raw => raw },
    DOMPurify: { sanitize: html => html },
    mermaid: { initialize() {} },
    FileReader: class {
      readAsText(file) { this.onload({ target: { result: file.content } }); }
    },
    setTimeout: callback => timers.push(callback), clearTimeout() {},
    STUDY_NOTES, BOOK_DOWNLOAD, YOUTUBE_COLLECTION, SPOTIFY_COLLECTION,
    fetch: async () => { throw new Error("Unexpected network request"); },
    AbortSignal
  };
  runInNewContext(appSource, context, { filename: "app.js" });
  if (library) runInNewContext(librarySource, context, { filename: "library.js" });
  return {
    element, document, window, storage, errors, downloads,
    documents: window.studyRoomDocuments,
    savedFiles: () => JSON.parse(storage.get("md-files")),
    async edit(raw) {
      await element("edit-mode-btn").emit("click");
      element("editor-input").value = raw;
      await element("editor-input").emit("input");
    },
    async closeActive() {
      const active = element("tab-bar").children.find(node => node.classList.contains("active"));
      await active.emit("click", { target: { classList: { contains: name => name === "tab-close" } } });
    },
    persist() { timers.at(-1)?.(); }
  };
}

test("the current reader has no Gemini UI, API-key handling or AI requests", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.doesNotMatch(html, /Ask AI|Google Gemini|aistudio\.google\.com/);
  assert.doesNotMatch(html, /\bid="(?:ai-[^"]+|api-key-input|save-api-key-btn|settings-saved-msg)"/);
  assert.doesNotMatch(appSource, /generativelanguage|md-gemini-key|sendAiQuery|aiFloatBtn|apiKeyInput/);
});

test("settings retains the local text reverser and clears it on close", async () => {
  const ui = fixture();
  const modal = ui.element("settings-modal");
  modal.classList.add("hidden");
  await ui.element("settings-btn").emit("click");
  assert.equal(modal.classList.contains("hidden"), false);
  ui.element("reverse-input").value = "Study 123";
  await ui.element("reverse-text-btn").emit("click");
  assert.equal(ui.element("reverse-output").value, "321 ydutS");
  await ui.element("settings-modal-close").emit("click");
  assert.equal(modal.classList.contains("hidden"), true);
  assert.equal(ui.element("reverse-input").value, "");
  assert.equal(ui.element("reverse-output").value, "");
  await ui.element("settings-btn").emit("click");
  ui.element("reverse-input").value = "Temporary";
  await ui.element("reverse-text-btn").emit("click");
  await modal.emit("click", { target: modal });
  assert.equal(modal.classList.contains("hidden"), true);
  assert.equal(ui.element("reverse-input").value, "");
  assert.equal(ui.element("reverse-output").value, "");
});

test("the empty starter stays out of collections; New and first typing create download-needed entries", async () => {
  const ui = fixture({}, { library: true });
  assert.equal(ui.documents.list().length, 0);
  assert.equal(ui.element("library-uploads-section").hidden, true);
  assert.equal(ui.element("library-created-section").hidden, true);
  await ui.element("create-btn").emit("click");
  const created = ui.documents.list()[0];
  assert.equal(created.origin, "created");
  assert.equal(created.needsDownload, true);
  assert.equal(ui.element("library-created-section").hidden, false);
  assert.equal(ui.element("library-created").children.length, 1);
  const other = fixture();
  await other.edit("# First note");
  assert.equal(other.documents.list()[0].origin, "created");
  assert.equal(other.documents.list()[0].needsDownload, true);
});

test("untouched uploads are clean; content changes, reversion, rename and download follow their true baseline", async () => {
  const ui = fixture({}, { library: true });
  const id = ui.documents.open("maths.md", "# Original");
  const entry = () => ui.documents.list().find(file => file.id === id);
  assert.equal(entry().origin, "upload");
  assert.equal(entry().needsDownload, false);
  const warning = ui.element("library-uploads").children[0].children[1];
  assert.equal(warning.classList.contains("hidden"), true);
  await ui.edit("# Edited");
  assert.equal(entry().needsDownload, true);
  assert.equal(warning.classList.contains("hidden"), false);
  await ui.edit("# Original");
  assert.equal(entry().needsDownload, false);
  ui.documents.rename(id, "Algebra");
  assert.equal(entry().name, "Algebra.md");
  assert.equal(entry().needsDownload, true);
  await ui.element("download-btn").emit("click");
  assert.equal(ui.downloads.at(-1).name, "Algebra.md");
  assert.equal(entry().needsDownload, false);
  await ui.edit("# Further changes");
  assert.equal(entry().needsDownload, true);
  await ui.element("preview-mode-btn").emit("click");
  const restored = fixture(Object.fromEntries(ui.storage));
  assert.equal(restored.documents.list().find(file => file.id === id).needsDownload, true);
  assert.equal(restored.documents.active().raw, "# Further changes");
});

test("created download baselines and identities survive closing tabs, reloading and reopening", async () => {
  const ui = fixture({}, { library: true });
  await ui.element("create-btn").emit("click");
  const id = ui.documents.active().id;
  await ui.edit("# Created");
  ui.documents.rename(id, "Revision.md");
  await ui.element("download-btn").emit("click");
  assert.equal(ui.documents.list()[0].needsDownload, false);
  await ui.closeActive();
  assert.equal(ui.documents.list()[0].id, id);
  assert.equal(ui.documents.list()[0].active, false);
  const restored = fixture(Object.fromEntries(ui.storage), { library: true });
  restored.documents.activate(id);
  assert.equal(restored.documents.active().name, "Revision.md");
  assert.equal(restored.documents.active().raw, "# Created");
  assert.equal(restored.documents.list()[0].needsDownload, false);
  await restored.edit("# Changed again");
  assert.equal(restored.documents.list()[0].needsDownload, true);
  assert.equal(restored.documents.list().length, 1);
});

test("closing the last tab creates only an unlisted blank; bundled drafts stay outside personal collections", async () => {
  const ui = fixture();
  const id = ui.documents.active().id;
  await ui.closeActive();
  assert.notEqual(ui.documents.active().id, id);
  assert.equal(ui.documents.list().length, 0);
  const bundled = ui.documents.open("Study.md", "# Bundled", "study-plan");
  await ui.edit("# My edits");
  await ui.closeActive();
  assert.equal(ui.documents.list().length, 0);
  assert.equal(ui.documents.activateLibraryFile("study-plan"), true);
  assert.equal(ui.documents.active().id, bundled);
  assert.equal(ui.documents.active().raw, "# My edits");
});

test("legacy drafts migrate without losing content or themes and unknown disk baselines remain download-needed", () => {
  const ui = fixture({
    "md-files": JSON.stringify([
      { id: 7, name: "Untitled.md", raw: "", theme: "gd-cityscape" },
      { id: 8, name: "Untitled.md", raw: "# Created earlier", theme: "gd-90s-anime" },
      { id: 9, name: "notes.md", raw: "# Possibly edited", theme: "default" },
      { id: 10, name: "Study.md", raw: "# Bundled draft", theme: "default", libraryId: "study-plan" }
    ]),
    "md-active-id": "8"
  });
  const entries = ui.documents.list();
  assert.equal(entries.length, 2);
  assert.equal(entries[0].origin, "created");
  assert.equal(entries[1].origin, "upload");
  assert.equal(entries.every(entry => entry.needsDownload), true);
  assert.equal(ui.documents.active().raw, "# Created earlier");
  assert.equal(ui.document.body.getAttribute("data-theme"), "gd-90s-anime");
  ui.documents.rename(8, "Old revision");
  assert.equal(ui.savedFiles().find(file => file.id === 8).theme, "gd-90s-anime");
  assert.equal(ui.savedFiles().find(file => file.id === 10).raw, "# Bundled draft");
});

test("inline renaming validates filenames, supports cancel and keeps collection rows safe and stable", async () => {
  const ui = fixture({}, { library: true });
  const id = ui.documents.open("upload.md", "# Keep me");
  const row = ui.element("library-uploads").children[0];
  const rename = row.children[2];
  await rename.emit("click");
  let form = row.children[0];
  let input = form.children[0];
  input.value = "bad/name";
  await form.emit("submit", { preventDefault() {} });
  assert.equal(input.validityReported, true);
  assert.equal(ui.documents.active().name, "upload.md");
  assert.match(ui.element("library-status").textContent, /filename/);
  input.value = "My revision.md";
  await input.emit("input");
  await form.emit("submit", { preventDefault() {} });
  assert.equal(ui.documents.active().name, "My revision.md");
  assert.equal(row.children[0].textContent, "My revision.md");
  assert.equal(row.children[1].classList.contains("hidden"), false);
  await rename.emit("click");
  form = row.children[0];
  await form.emit("keydown", { key: "Escape", preventDefault() {}, stopPropagation() {} });
  assert.equal(row.children[2], rename);
  for (const invalid of ["", "CON", "..", "NUL.md", "Trailing.", "x".repeat(161)]) {
    assert.throws(() => ui.documents.rename(id, invalid), /filename/);
  }
  assert.equal(ui.documents.active().raw, "# Keep me");
});

test("browse and drop imports grow Uploads; dragging a collection row activates its identity without duplicates", async () => {
  const ui = fixture({}, { library: true });
  const input = ui.element("library-local-input");
  await input.emit("change", { target: { files: [
    { name: "one.md", size: 6, text: async () => "# One" },
    { name: "two.md", size: 6, text: async () => "# Two" },
    { name: "bad.txt", size: 6 }
  ], value: "" } });
  // The change handler launches run(), whose sequential file reads finish asynchronously.
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(ui.documents.list().length, 2);
  assert.equal(ui.element("library-uploads").children.length, 2);
  assert.match(ui.element("library-status").textContent, /bad.txt: not a Markdown/);
  const first = ui.documents.list()[0];
  const data = new Map();
  const transfer = {
    types: ["application/x-study-room-document"], files: [],
    setData: (type, value) => data.set(type, value),
    getData: type => data.get(type) || ""
  };
  await ui.element("library-uploads").children[0].children[0].emit("dragstart", { dataTransfer: transfer });
  await ui.element(".app-wrapper").emit("drop", {
    dataTransfer: transfer, preventDefault() {}, stopPropagation() {}
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(ui.documents.active().id, first.id);
  assert.equal(ui.documents.list().length, 2);
  ui.element("file-input-2").files = [{ name: "tab-upload.md", size: 4, content: "# Tab" }];
  await ui.element("file-input-2").emit("change");
  assert.equal(ui.documents.list().length, 3);
});

test("storage failures are visible without hiding documents or their download-needed indicators", async () => {
  const ui = fixture({}, { library: true, storageFailure: true });
  await ui.element("create-btn").emit("click");
  await ui.edit("# Keep a copy");
  assert.equal(ui.documents.list()[0].needsDownload, true);
  assert.equal(ui.element("library-created-section").hidden, false);
  assert.match(ui.element("document-status").textContent, /storage failed/);
  assert.ok(ui.errors.length);
});

test("unreadable stored drafts are not overwritten by initialization or subsequent edits", async () => {
  for (const saved of ["{broken json", JSON.stringify([{ id: 4, name: "notes.md", raw: null }])]) {
    const ui = fixture({ "md-files": saved });
    assert.equal(ui.storage.get("md-files"), saved);
    await ui.edit("# Temporary recovery note");
    await ui.element("preview-mode-btn").emit("click");
    assert.equal(ui.storage.get("md-files"), saved);
    assert.match(ui.element("document-status").textContent, /not been overwritten/);
    assert.equal(ui.documents.list()[0].needsDownload, true);
    assert.ok(ui.errors.length);
  }
});

test("bundled resources start hidden and the reveal event expands only their existing UI", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /id="library-bundled" hidden/);
  assert.match(html, /id="library-uploads-section" hidden/);
  assert.match(html, /id="library-created-section" hidden/);
  const ui = fixture({}, { library: true });
  ui.element("library-bundled").hidden = true;
  ui.element("library-body").classList.add("hidden");
  await ui.window.emit("study-room-reveal-bundled");
  assert.equal(ui.element("library-bundled").hidden, false);
  assert.equal(ui.element("library-body").classList.contains("hidden"), false);
  assert.equal(ui.element("library-notes").children.length, 8);
  assert.equal(ui.element("library-sdp-notes").children.length, 1);
  assert.equal(ui.element("book-download").href, BOOK_DOWNLOAD.url);
  for (const [id, collection] of [["yt-saved", YOUTUBE_COLLECTION], ["sp-saved", SPOTIFY_COLLECTION]]) {
    assert.deepEqual(ui.element(id).children.map(option => option.value), collection.map(item => item.url));
    assert.deepEqual(ui.element(id).children.map(option => option.textContent), collection.map(item => item.title));
  }
});
