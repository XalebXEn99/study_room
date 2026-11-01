import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { MOTIVATION_QUOTES } from "../motivation-data.js";

function fixture(t, saved = {}, overrides = {}) {
  const nodes = new Map();
  const intervals = [];
  const observations = [];
  const storage = new Map(Object.entries(saved));
  const played = [];
  const clock = { now: 10000 };
  function node(id) {
    if (nodes.has(id)) return nodes.get(id);
    const listeners = new Map();
    const classes = new Set(id === "timer-floating" ? ["hidden"] : []);
    const element = {
      id, value: id === "timer-minutes" ? "25" : "0", textContent: "", dataset: {},
      open: false, disabled: false, currentTime: 0, attributes: {}, paused: true,
      classList: {
        add: (...names) => names.forEach(name => classes.add(name)),
        remove: (...names) => names.forEach(name => classes.delete(name)),
        contains: name => classes.has(name),
        toggle(name, force) {
          if (force ?? !classes.has(name)) classes.add(name);
          else classes.delete(name);
        }
      },
      style: { setProperty() {} },
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, callback) {
        if (!listeners.has(name)) listeners.set(name, []);
        listeners.get(name).push(callback);
      },
      async emit(name, event = {}) {
        for (const callback of listeners.get(name) || []) await callback(event);
      },
      showModal() { this.open = true; },
      close() { this.open = false; void this.emit("close"); },
      pause() { this.paused = true; },
      play() { this.paused = false; played.push(this.src); return Promise.resolve(); },
      getBoundingClientRect() { return { top: 50, bottom: 550, left: 20, right: 520 }; },
      focus(options) { this.focusOptions = options; },
      scrollIntoView(options) { this.scrollOptions = options; }
    };
    nodes.set(id, element);
    return element;
  }
  const presets = [25, 20, 50, 5].map(minutes => {
    const preset = node("preset-" + minutes);
    preset.dataset = { minutes: String(minutes), hint: "A study technique." };
    return preset;
  });
  const document = {
    hidden: false,
    getElementById: node,
    querySelector: node,
    querySelectorAll: () => presets,
    addEventListener: (name, callback) => node("document").addEventListener(name, callback)
  };
  const globals = {
    document,
    window: { addEventListener() {}, matchMedia: () => ({ matches: false }) },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key)
    },
    ResizeObserver: class { observe() {} },
    IntersectionObserver: class {
      constructor(callback, options) { this.callback = callback; this.options = options; }
      observe(target) { observations.push({ callback: this.callback, target, options: this.options }); }
    },
    setInterval(callback, delay) { intervals.push({ callback, delay }); return intervals.length; },
    ...overrides
  };
  const previous = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  t.after(() => {
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  t.mock.method(Date, "now", () => clock.now);
  return { node, intervals, observations, storage, played, clock, document };
}

test("the floating timer follows readout visibility and links back to the controls", async t => {
  const ui = fixture(t);
  await import("../timer.js?visibility");
  const floating = ui.node("timer-floating");
  const observation = ui.observations[0];
  assert.equal(observation.target.id, "timer-display");
  for (const [isIntersecting, intersectionRatio, hidden] of [[true, 1, true], [false, 0, false], [true, 0.5, false], [true, 1, true]]) {
    observation.callback([{ isIntersecting, intersectionRatio }]);
    assert.equal(floating.classList.contains("hidden"), hidden);
  }
  await floating.emit("click");
  assert.deepEqual(ui.node(".timer-panel").scrollOptions, { behavior: "smooth", block: "start" });
  assert.deepEqual(ui.node("timer-heading").focusOptions, { preventScroll: true });
});

test("both timer displays stay synchronized through start, pause, resume, expiry and reset", async t => {
  const ui = fixture(t);
  await import("../timer.js?synchronized");
  const tick = ui.intervals.find(item => item.delay === 500).callback;
  const check = (time, status) => {
    assert.equal(ui.node("timer-display").textContent, time);
    assert.equal(ui.node("timer-floating-display").textContent, time);
    assert.equal(ui.node("timer-floating-status").textContent, status);
  };
  check("25:00", "Ready");
  ui.node("timer-minutes").value = "0";
  ui.node("timer-seconds").value = "10";
  await ui.node("timer-form").emit("submit", { preventDefault() {} });
  ui.clock.now += 3000;
  tick();
  check("0:07", "Running");
  await ui.node("timer-pause").emit("click");
  ui.clock.now += 20000;
  tick();
  check("0:07", "Paused");
  await ui.node("timer-form").emit("submit", { preventDefault() {} });
  ui.clock.now += 7000;
  tick();
  check("0:00", "Time is up!");
  assert.equal(ui.node("timer-finished").open, true);
  await ui.node("timer-reset").emit("click");
  check("0:10", "Ready");
});

test("24 distinct encouragement clips contain playable MPEG data and publication attribution", async () => {
  assert.equal(MOTIVATION_QUOTES.length, 24);
  assert.equal(new Set(MOTIVATION_QUOTES.map(quote => quote.id)).size, 24);
  assert.equal(new Set(MOTIVATION_QUOTES.map(quote => quote.text)).size, 24);
  const hashes = new Set();
  for (const quote of MOTIVATION_QUOTES) {
    assert.equal(quote.audio, "assets/motivation/" + quote.id + ".mp3");
    const bytes = await readFile(new URL("../" + quote.audio, import.meta.url));
    assert.ok(bytes.length > 5000, quote.id + " is too small to contain the recording");
    assert.equal(bytes.toString("ascii", 0, 3), "ID3");
    const tagSize = bytes.subarray(6, 10).reduce((size, value) => size * 128 + value, 0);
    const offset = tagSize + 10;
    assert.equal(bytes[offset], 0xff);
    assert.equal(bytes[offset + 1] & 0xe0, 0xe0);
    assert.ok(bytes.subarray(0, offset).includes(Buffer.from("elevenlabs.io")));
    hashes.add(createHash("sha256").update(bytes.subarray(offset)).digest("hex"));
  }
  assert.equal(hashes.size, 24, "Each quote needs its own recording, not relabelled copies.");
});

test("rotating quotes remain silent and pause while the page is hidden", async t => {
  const ui = fixture(t);
  await import("../motivation.js?rotation");
  assert.equal(ui.played.length, 0);
  const rotate = ui.intervals.find(item => item.delay === 12000).callback;
  rotate();
  assert.equal(ui.node("study-quote").textContent, MOTIVATION_QUOTES[1].text);
  ui.document.hidden = true;
  rotate();
  assert.equal(ui.node("study-quote").textContent, MOTIVATION_QUOTES[1].text);
  assert.equal(ui.played.length, 0);
});

test("the book popup matches text to voice, shuffles without repeats, and supports replay and mute", async t => {
  const ui = fixture(t);
  await import("../motivation.js?controls");
  const texts = new Set();
  await ui.node("motivation-open").emit("click");
  assert.equal(ui.node("motivation-dialog").open, true);
  for (let i = 0; i < 24; i++) {
    if (i) await ui.node("motivation-next").emit("click");
    const text = ui.node("motivation-text").textContent;
    const quote = MOTIVATION_QUOTES.find(item => item.text === text);
    assert.ok(quote);
    assert.equal(ui.played.at(-1), quote.audio);
    texts.add(text);
  }
  assert.equal(texts.size, 24);
  const last = ui.node("motivation-text").textContent;
  await ui.node("motivation-next").emit("click");
  assert.notEqual(ui.node("motivation-text").textContent, last);
  await ui.node("motivation-replay").emit("click");
  assert.equal(ui.played.at(-1), ui.played.at(-2));
  await ui.node("motivation-voice").emit("click");
  assert.equal(ui.storage.get("study-room-encouragement-muted"), "true");
  assert.equal(ui.node("motivation-replay").disabled, true);
  const count = ui.played.length;
  await ui.node("motivation-next").emit("click");
  assert.equal(ui.played.length, count);
  await ui.node("motivation-voice").emit("click");
  assert.equal(ui.played.length, count + 1);
  await ui.node("motivation-dialog").emit("keydown", { key: "Escape", preventDefault() {} });
  assert.equal(ui.node("motivation-dialog").open, false);
  assert.equal(ui.node("motivation-audio").paused, true);
  assert.equal(ui.node("motivation-audio").currentTime, 0);
});

test("saved mute is respected and a blocked playback is reported", async t => {
  const ui = fixture(t, { "study-room-encouragement-muted": "true" });
  await import("../motivation.js?errors");
  await ui.node("motivation-open").emit("click");
  assert.equal(ui.played.length, 0);
  const logged = t.mock.method(console, "error", () => {});
  ui.node("motivation-audio").play = () => Promise.reject(new Error("Playback blocked"));
  await ui.node("motivation-voice").emit("click");
  await Promise.resolve();
  assert.match(ui.node("motivation-status").textContent, /could not play/);
  assert.equal(logged.mock.callCount(), 1);
});

test("both corner media launchers are icon-only and retain accessible names", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  for (const id of ["spotify-pill", "youtube-pill"]) {
    const button = html.match(new RegExp('<button id="' + id + '"[\\s\\S]*?</button>'))?.[0];
    assert.ok(button);
    assert.match(button, /aria-label="[^"]+"/);
    assert.match(button, /title="[^"]+"/);
    assert.equal(button.replace(/<[^>]*>/g, "").trim(), "");
  }
});

test("music activity follows SDK playback and survives minimising without changing playback", async t => {
  const callbacks = new Map();
  let disconnected = false;
  const ui = fixture(t, {
    "md-spotify-token": JSON.stringify({ access_token: "test-only", expires_at: 1000000000 })
  }, {
    Spotify: {
      Player: class {
        addListener(name, callback) { callbacks.set(name, callback); }
        connect() { return Promise.resolve(true); }
        disconnect() { disconnected = true; }
      }
    },
    sessionStorage: { getItem: () => null },
    fetch: async () => ({ json: async () => ({ product: "premium" }) }),
    setTimeout: () => 0
  });
  window.location = { origin: "https://example.test", pathname: "/", search: "" };
  await import("../spotify.js?activity");
  window.onSpotifyWebPlaybackSDKReady();
  await new Promise(setImmediate);
  callbacks.get("ready")({ device_id: "test-device" });
  const track = {
    paused: false,
    track_window: { current_track: { name: "Test track", artists: [{ name: "Test artist" }], album: { images: [] } } }
  };
  const playing = () => ui.node(".music-slot").classList.contains("is-playing");
  assert.equal(playing(), false);
  callbacks.get("player_state_changed")(track);
  assert.equal(playing(), true);
  assert.equal(ui.node("sp-play").attributes["aria-label"], "Pause");
  assert.equal(ui.node("spotify-pill").attributes["aria-label"], "Music is playing");
  await ui.node("spotify-pill").emit("click");
  await ui.node("sp-collapse-btn").emit("click");
  assert.equal(playing(), true);
  assert.equal(disconnected, false);
  callbacks.get("player_state_changed")({ ...track, paused: true });
  assert.equal(playing(), false);
  assert.equal(ui.node("sp-play").attributes["aria-label"], "Play");
  for (const event of ["not_ready", "initialization_error", "authentication_error", "account_error", "playback_error"]) {
    callbacks.get("player_state_changed")(track);
    callbacks.get(event)({ message: "Test playback interruption" });
    assert.equal(playing(), false, event + " must stop the indicator");
  }
  callbacks.get("player_state_changed")(track);
  callbacks.get("player_state_changed")(null);
  assert.equal(playing(), false);
  callbacks.get("player_state_changed")(track);
  await ui.node("sp-logout-btn").emit("click");
  assert.equal(playing(), false);
  assert.equal(disconnected, true);
  callbacks.get("player_state_changed")(track);
  assert.equal(playing(), false, "A late SDK event must not reactivate music after logout");
});
