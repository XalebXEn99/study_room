import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";

const source = await readFile(new URL("../youtube.js", import.meta.url), "utf8");
const flush = () => new Promise(resolve => setImmediate(resolve));

function fixture({ supported = true, secure = true, requestError = null, withApi = true, autoReady = true } = {}) {
  const players = [];
  const windows = [];
  const requests = [];
  const errors = [];
  const timers = [];
  const storage = new Map();
  function events(target) {
    const listeners = new Map();
    target.addEventListener = (name, callback, options = {}) => {
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push({ callback, once: options.once });
    };
    target.emit = async (name, event = {}) => {
      for (const listener of [...listeners.get(name) || []]) {
        if (listener.once) listeners.set(name, listeners.get(name).filter(item => item !== listener));
        await listener.callback.call(target, event);
      }
    };
    return target;
  }
  function node(document, tag = "div") {
    const classes = new Set();
    const item = events({
      ownerDocument: document, tagName: tag.toUpperCase(), parentNode: null, children: [],
      textContent: "", value: "", attributes: {}, disabled: false,
      classList: {
        add: (...names) => names.forEach(name => classes.add(name)),
        remove: (...names) => names.forEach(name => classes.delete(name)),
        contains: name => classes.has(name),
        toggle(name, force) {
          if (force ?? !classes.has(name)) classes.add(name);
          else classes.delete(name);
        }
      },
      setAttribute(name, value) { this.attributes[name] = value; },
      removeAttribute(name) { delete this.attributes[name]; },
      append(child) {
        child.remove();
        this.children.push(child);
        child.parentNode = this;
        function adopt(element) {
          element.ownerDocument = item.ownerDocument;
          element.children.forEach(adopt);
        }
        adopt(child);
      },
      insertBefore(child, anchor) {
        child.remove();
        const index = this.children.indexOf(anchor);
        assert.notEqual(index, -1);
        this.children.splice(index, 0, child);
        child.parentNode = this;
        child.ownerDocument = this.ownerDocument;
      },
      remove() {
        if (this.parentNode) {
          this.parentNode.children = this.parentNode.children.filter(child => child !== this);
          this.parentNode = null;
        }
      },
      replaceChildren() { [...this.children].forEach(child => child.remove()); }
    });
    return item;
  }
  function createWindow(name) {
    const window = events({ name, closed: false, location: { origin: "http://localhost:4173" }, isSecureContext: secure });
    const elements = new Map();
    const document = {
      defaultView: window,
      createElement: tag => node(document, tag),
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, node(document));
        return elements.get(id);
      }
    };
    document.head = node(document, "head");
    document.body = node(document, "body");
    window.document = document;
    window.close = () => {
      if (window.closed) return;
      window.closed = true;
      void window.emit("pagehide");
    };
    window.YT = {
      Player: class {
        constructor(frame, { events }) {
          this.frame = frame;
          this.events = events;
          this.window = window;
          this.calls = [];
          const pathId = new URL(frame.src).pathname.split("/").at(-1);
          this.state = {
            videoId: pathId.length === 11 ? pathId : "abcdefghijk",
            time: 0, index: 0, status: 1, volume: 60, muted: false
          };
          players.push(this);
          if (autoReady) queueMicrotask(() => events.onReady({ target: this }));
        }
        getVideoUrl() { return "https://www.youtube.com/watch?v=" + this.state.videoId; }
        getCurrentTime() { return this.state.time; }
        getPlaylistIndex() { return this.state.index; }
        getPlayerState() { return this.state.status; }
        getVolume() { return this.state.volume; }
        isMuted() { return this.state.muted; }
        setVolume(value) { this.state.volume = value; }
        mute() { this.state.muted = true; }
        unMute() { this.state.muted = false; }
        loadPlaylist(value) { this.restore("loadPlaylist", value, 1); }
        cuePlaylist(value) { this.restore("cuePlaylist", value, 5); }
        loadVideoById(value) { this.restore("loadVideoById", value, 1); }
        cueVideoById(value) { this.restore("cueVideoById", value, 5); }
        restore(method, value, status) {
          this.calls.push([method, JSON.parse(JSON.stringify(value))]);
          this.state.time = value.startSeconds;
          this.state.index = value.index ?? 0;
          this.state.status = status;
          if (value.videoId) this.state.videoId = value.videoId;
        }
        destroy() { this.destroyed = true; this.frame.remove(); }
      }
    };
    return window;
  }
  const window = createWindow("main");
  if (!withApi) delete window.YT;
  if (supported) window.documentPictureInPicture = {
    async requestWindow(options) {
      requests.push(JSON.parse(JSON.stringify(options)));
      if (requestError) throw requestError;
      const pip = createWindow("pip");
      windows.push(pip);
      return pip;
    }
  };
  const element = id => window.document.getElementById(id);
  const player = element("youtube-player");
  player.classList.add("hidden");
  const frame = element("yt-frame");
  frame.classList.add("hidden");
  player.append(frame);
  player.append(element("yt-pip-status"));
  player.append(element("yt-error"));
  runInNewContext(source, {
    window, document: window.document, URL, WeakMap, Promise,
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    setTimeout(callback, delay) { const timer = { callback, delay }; timers.push(timer); return timer; },
    clearTimeout(timer) { if (timer) timer.cleared = true; },
    console: { error: (...args) => errors.push(args) }
  }, { filename: "youtube.js" });
  return {
    element, window, players, windows, requests, errors, timers, storage,
    async click(id) { await element(id).emit("click"); await flush(); },
    async load(url = "https://www.youtube.com/playlist?list=PLtest") {
      element("yt-url-input").value = url;
      await element("yt-load-btn").emit("click");
      await flush();
    }
  };
}

test("YouTube embeds retain playlist parsing, permissions and compact/minimise behavior", async () => {
  const ui = fixture();
  assert.equal(ui.element("yt-pip-btn").classList.contains("hidden"), true);
  await ui.click("youtube-pill");
  await ui.load("https://youtube.com/watch?v=abcdefghijk&list=PLtest&si=tracking");
  const frame = ui.element("yt-frame").children[0];
  const url = new URL(frame.src);
  assert.equal(url.pathname, "/embed/abcdefghijk");
  assert.equal(url.searchParams.get("list"), "PLtest");
  assert.equal(url.searchParams.get("enablejsapi"), "1");
  assert.equal(url.searchParams.get("origin"), "http://localhost:4173");
  assert.match(frame.allow, /picture-in-picture/);
  assert.equal(ui.element("youtube-player").classList.contains("compact"), true);
  await ui.click("yt-expand-btn");
  assert.equal(ui.element("youtube-player").classList.contains("compact"), false);
  await ui.click("yt-collapse-btn");
  assert.equal(ui.players[0].destroyed, undefined);
  assert.equal(ui.element("yt-frame").children[0], frame);
});

test("PiP transfers the playing playlist and restores its latest episode and position when closed", async () => {
  const ui = fixture();
  await ui.load();
  Object.assign(ui.players[0].state, { videoId: "123456789ab", time: 83.75, index: 2, volume: 35, muted: true });
  await ui.click("yt-pip-btn");
  const pip = ui.windows[0];
  assert.deepEqual(ui.requests, [{ width: 480, height: 300 }]);
  assert.equal(ui.element("yt-frame").ownerDocument, pip.document);
  assert.equal(ui.element("yt-pip-btn").textContent, "Return");
  assert.equal(ui.element("yt-pip-btn").attributes["aria-pressed"], "true");
  assert.equal(ui.element("yt-pip-status").classList.contains("hidden"), false);
  assert.match(pip.document.head.children[0].textContent, /width:100%;height:100%/);
  assert.doesNotMatch(pip.document.head.children[0].textContent, /480px|300px/);
  assert.deepEqual(ui.players[1].calls[0], ["loadPlaylist", {
    list: "PLtest", listType: "playlist", index: 2, startSeconds: 83.75
  }]);
  assert.equal(ui.players[1].state.muted, true);
  assert.equal(ui.players[1].state.volume, 35);
  Object.assign(ui.players[1].state, { videoId: "ZYXWVUTSRQP", time: 142.5, index: 4, muted: false, volume: 70 });
  pip.close();
  await flush();
  assert.equal(ui.element("yt-frame").ownerDocument, ui.window.document);
  assert.equal(ui.element("yt-pip-btn").textContent, "PiP");
  assert.equal(ui.element("yt-pip-status").classList.contains("hidden"), true);
  assert.equal(new URL(ui.players[2].frame.src).pathname, "/embed/ZYXWVUTSRQP");
  assert.deepEqual(ui.players[2].calls[0], ["loadPlaylist", {
    list: "PLtest", listType: "playlist", index: 4, startSeconds: 142.5
  }]);
  assert.equal(ui.players[2].state.muted, false);
  assert.equal(ui.players[2].state.volume, 70);
});

test("a paused standalone video stays paused when popped out and returned with the button", async () => {
  const ui = fixture();
  await ui.load("https://youtu.be/abcdefghijk");
  Object.assign(ui.players[0].state, { time: 26.5, status: 2 });
  await ui.click("yt-pip-btn");
  assert.deepEqual(ui.players[1].calls[0], ["cueVideoById", { videoId: "abcdefghijk", startSeconds: 26.5 }]);
  await ui.click("yt-pip-btn");
  assert.equal(ui.windows[0].closed, true);
  assert.equal(ui.players.length, 3);
  assert.deepEqual(ui.players[2].calls[0], ["cueVideoById", { videoId: "abcdefghijk", startSeconds: 26.5 }]);
  assert.equal(ui.players[2].state.status, 5);
});

test("Stop closes PiP without recreating playback, and playlist changes target the floating window", async () => {
  const ui = fixture();
  await ui.load();
  await ui.click("yt-pip-btn");
  const pip = ui.windows[0];
  ui.element("yt-saved").value = "https://youtube.com/playlist?list=PLanother";
  await ui.element("yt-saved").emit("change");
  await flush();
  assert.equal(ui.windows.length, 1);
  assert.equal(ui.players.at(-1).window, pip);
  assert.equal(new URL(ui.players.at(-1).frame.src).searchParams.get("list"), "PLanother");
  const count = ui.players.length;
  await ui.click("yt-clear-btn");
  assert.equal(pip.closed, true);
  assert.equal(ui.players.length, count);
  assert.equal(ui.element("yt-frame").children.length, 0);
  assert.equal(ui.element("yt-frame").classList.contains("hidden"), true);
  assert.equal(ui.element("yt-pip-btn").classList.contains("hidden"), true);
});

test("unsupported, insecure and denied PiP requests leave playback in place and show errors", async () => {
  for (const options of [{ supported: false }, { secure: false }, { requestError: new Error("Permission denied") }]) {
    const ui = fixture(options);
    await ui.load();
    const frame = ui.element("yt-frame").children[0];
    await ui.click("yt-pip-btn");
    assert.equal(ui.element("yt-frame").children[0], frame);
    assert.equal(ui.element("yt-frame").ownerDocument, ui.window.document);
    assert.equal(ui.element("yt-error").classList.contains("hidden"), false);
    assert.match(ui.element("yt-error").textContent, /supported desktop Chrome|Permission denied/);
    assert.equal(ui.element("yt-pip-btn").disabled, false);
  }
});

test("PiP waits for the YouTube API and exposes script failures without removing the normal player", async () => {
  const ui = fixture({ withApi: false });
  await ui.load();
  await ui.click("yt-pip-btn");
  assert.equal(ui.requests.length, 0);
  assert.match(ui.element("yt-error").textContent, /Wait for YouTube/);
  const script = ui.window.document.head.children[0];
  assert.equal(script.src, "https://www.youtube.com/iframe_api");
  script.onerror();
  await flush();
  assert.match(ui.element("yt-error").textContent, /player API could not load/);
  assert.equal(ui.element("yt-frame").children.length, 1);
  assert.equal(ui.errors.length, 1);
});

test("a Stop while the PiP window is opening cannot resurrect the cleared video", async () => {
  const ui = fixture();
  await ui.load();
  let resolveWindow;
  ui.window.documentPictureInPicture.requestWindow = () => new Promise(resolve => { resolveWindow = resolve; });
  const pending = ui.element("yt-pip-btn").emit("click");
  await ui.click("yt-clear-btn");
  const discarded = { closed: false, close() { this.closed = true; } };
  resolveWindow(discarded);
  await pending;
  assert.equal(discarded.closed, true);
  assert.equal(ui.element("yt-frame").children.length, 0);
  assert.equal(ui.element("yt-pip-btn").classList.contains("hidden"), true);
});
