import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { ANIME_BACKGROUNDS } from "../anime-background-data.js";

const flush = () => new Promise(resolve => setImmediate(resolve));
let fixtureId = 0;

async function fixture(t, { theme = "gd-90s-anime", reducedMotion = false } = {}) {
  const nodes = new Map();
  const images = [];
  const timers = new Map();
  const animations = [];
  const errors = [];
  const failed = new Set();
  let autoLoad = true;
  let observer;
  let timerId = 0;
  function node(id) {
    if (nodes.has(id)) return nodes.get(id);
    const listeners = new Map();
    const classes = new Set();
    const element = {
      hidden: true, disabled: false, textContent: "", dataset: {}, style: {}, attributes: {},
      firstElementChild: { textContent: "" },
      classList: {
        add: name => classes.add(name),
        remove: name => classes.delete(name),
        contains: name => classes.has(name)
      },
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, callback) { listeners.set(name, callback); },
      emit(name) { listeners.get(name)?.(); },
      querySelectorAll: () => [node("layer-0"), node("layer-1")],
      animate(frames, options) {
        const animation = { frames, options, finished: Promise.resolve(), finish() {} };
        animations.push(animation);
        return animation;
      }
    };
    nodes.set(id, element);
    return element;
  }
  const body = node("body");
  body.dataset.theme = theme;
  const document = node("document");
  document.body = body;
  document.hidden = false;
  document.getElementById = node;
  const motion = node("motion");
  motion.matches = reducedMotion;
  const globals = {
    document,
    window: { matchMedia: () => motion },
    MutationObserver: class {
      constructor(callback) { observer = callback; }
      observe(target, options) {
        assert.equal(target, body);
        assert.deepEqual(options.attributeFilter, ["data-theme"]);
      }
    },
    Image: class {
      set src(url) {
        this.url = url;
        images.push(this);
        if (autoLoad) queueMicrotask(() => failed.has(url) ? this.onerror() : this.onload());
      }
    },
    setTimeout(callback, delay) {
      const id = ++timerId;
      timers.set(id, { callback, delay });
      return id;
    },
    clearTimeout: id => timers.delete(id)
  };
  const previous = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  t.mock.method(console, "error", (...args) => errors.push(args));
  t.after(() => {
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  await import("../anime-background.js?fixture=" + ++fixtureId);
  await flush();
  return {
    node, document, motion, images, timers, animations, errors, failed,
    holdImages() { autoLoad = false; },
    async theme(value) { body.dataset.theme = value; observer(); await flush(); },
    async click(id) { node(id).emit("click"); await flush(); },
    async tick() {
      assert.equal(timers.size, 1);
      const [id, timer] = [...timers][0];
      assert.equal(timer.delay, 45000);
      timers.delete(id);
      timer.callback();
      await flush();
    }
  };
}

test("anime scenes rotate red, green, yellow and blue only in the selected theme", async t => {
  const ui = await fixture(t, { theme: "default" });
  assert.equal(ui.images.length, 0);
  assert.equal(ui.timers.size, 0);
  assert.equal(ui.node("anime-background-controls").hidden, true);
  await ui.theme("gd-90s-anime");
  for (const id of ["red", "green", "yellow", "blue", "red"]) {
    assert.equal(ui.document.body.dataset.animeScene, id);
    assert.equal(ui.node("anime-background").hidden, false);
    assert.equal(["layer-0", "layer-1"].filter(layer => ui.node(layer).classList.contains("is-visible")).length, 1);
    await ui.tick();
  }
  assert.equal(ui.animations[0].options.duration, 1400);
  assert.deepEqual(ui.animations[0].frames, [{ opacity: 0 }, { opacity: 1 }]);
  await ui.theme("gd-cityscape");
  assert.equal(ui.timers.size, 0);
  assert.equal(ui.node("anime-background-controls").hidden, true);
  assert.equal(ui.node("anime-background").hidden, true);
  assert.equal(ui.document.body.dataset.animeScene, undefined);
});

test("pause stops automatic rotation; Next still changes scenes and Resume restarts it", async t => {
  const ui = await fixture(t);
  await ui.click("anime-background-pause");
  assert.equal(ui.timers.size, 0);
  assert.equal(ui.node("anime-background-pause").attributes["aria-pressed"], "true");
  await ui.click("anime-background-next");
  assert.equal(ui.document.body.dataset.animeScene, "green");
  assert.equal(ui.timers.size, 0);
  await ui.click("anime-background-pause");
  assert.equal(ui.timers.size, 1);
  await ui.tick();
  assert.equal(ui.document.body.dataset.animeScene, "yellow");
});

test("hidden tabs and theme switches discard in-flight backgrounds and stop timers", async t => {
  const ui = await fixture(t);
  ui.holdImages();
  await ui.tick();
  const pending = ui.images.at(-1);
  ui.document.hidden = true;
  ui.document.emit("visibilitychange");
  pending.onload();
  await flush();
  assert.equal(ui.document.body.dataset.animeScene, "red");
  assert.equal(ui.timers.size, 0);
  ui.document.hidden = false;
  ui.document.emit("visibilitychange");
  await flush();
  assert.equal(ui.timers.size, 1);
  await ui.tick();
  const obsolete = ui.images.at(-1);
  await ui.theme("gd-cityscape");
  obsolete.onload();
  await flush();
  assert.equal(ui.document.body.dataset.animeScene, undefined);
  assert.equal(ui.node("anime-background").hidden, true);
  assert.equal(ui.timers.size, 0);
});

test("reduced motion uses static scenes, permits manual Next and follows preference changes", async t => {
  const ui = await fixture(t, { reducedMotion: true });
  assert.equal(ui.document.body.dataset.animeScene, "red");
  assert.equal(ui.timers.size, 0);
  assert.equal(ui.animations.length, 0);
  assert.equal(ui.node("anime-background-pause").disabled, true);
  await ui.click("anime-background-next");
  assert.equal(ui.document.body.dataset.animeScene, "green");
  assert.equal(ui.animations.length, 0);
  ui.motion.matches = false;
  ui.motion.emit("change");
  assert.equal(ui.timers.size, 1);
  ui.motion.matches = true;
  ui.motion.emit("change");
  assert.equal(ui.timers.size, 0);
});

test("failed images preserve the current scene, report errors and allow skipping to another", async t => {
  const ui = await fixture(t);
  ui.failed.add(ANIME_BACKGROUNDS[1].url);
  await ui.tick();
  assert.equal(ui.document.body.dataset.animeScene, "red");
  assert.equal(ui.errors.length, 1);
  assert.match(ui.node("anime-background-status").textContent, /Could not change background/);
  assert.equal(ui.timers.size, 0);
  assert.equal(ui.node("anime-background-next").disabled, false);
  await ui.click("anime-background-next");
  assert.equal(ui.document.body.dataset.animeScene, "yellow");
  assert.equal(ui.node("anime-background-status").textContent, "");
  assert.equal(ui.timers.size, 0);
});

test("anime reading text and links meet 4.5:1 contrast in every scene palette", async () => {
  const css = await readFile(new URL("../graphic-design.css", import.meta.url), "utf8");
  function luminance(hex) {
    return hex.match(/[a-f\d]{2}/gi).map(value => {
      const channel = parseInt(value, 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
  }
  const base = css.match(/body\[data-theme="gd-90s-anime"\] \{([^}]+)\}/)[1];
  for (const scene of ANIME_BACKGROUNDS) {
    const override = css.match(new RegExp('body\\[data-theme="gd-90s-anime"\\]\\[data-anime-scene="' + scene.id + '"\\] \\{([^}]+)\\}'))?.[1] || "";
    const palette = base + override;
    const colour = name => [...palette.matchAll(new RegExp("--" + name + ": (#[a-f\\d]{6})", "g"))].at(-1)[1];
    for (const foreground of ["sp-text", "sp-accent"]) {
      for (const background of ["sp-surface", "gd-inset"]) {
        const ratio = (luminance(colour(foreground)) + 0.05) / (luminance(colour(background)) + 0.05);
        assert.ok(ratio >= 4.5, scene.id + " " + foreground + "/" + background + ": " + ratio);
      }
    }
  }
});
