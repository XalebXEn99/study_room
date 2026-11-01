import { ANIME_BACKGROUNDS } from "./anime-background-data.js";

const backdrop = document.getElementById("anime-background");
const layers = backdrop.querySelectorAll(".anime-background-layer");
const controls = document.getElementById("anime-background-controls");
const label = document.getElementById("anime-background-label");
const status = document.getElementById("anime-background-status");
const pause = document.getElementById("anime-background-pause");
const next = document.getElementById("anime-background-next");
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
let active = false;
let paused = false;
let loading = false;
let currentIndex = 0;
let nextIndex = 1;
let displayedIndex = -1;
let visibleLayer = 0;
let requestVersion = 0;
let timer = null;
let animation = null;

function clearTimer() {
  clearTimeout(timer);
  timer = null;
}

function updateControls() {
  pause.disabled = motion.matches;
  pause.setAttribute("aria-pressed", String(paused || motion.matches));
  pause.title = motion.matches ? "Automatic changes disabled for reduced motion" :
    paused ? "Resume background slideshow" : "Pause background slideshow";
  pause.firstElementChild.textContent = paused || motion.matches ? "\u25b6" : "\u23f8";
  next.disabled = loading;
}

function schedule() {
  clearTimer();
  if (active && !document.hidden && !paused && !motion.matches && !loading && displayedIndex >= 0) {
    timer = setTimeout(() => void showScene(nextIndex, true), 45000);
  }
}

async function showScene(index, automatic = false) {
  if (!active || document.hidden) return;
  clearTimer();
  const version = ++requestVersion;
  const scene = ANIME_BACKGROUNDS[index];
  loading = true;
  updateControls();
  try {
    if (displayedIndex !== index) {
      await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = () => reject(new Error("Could not load " + scene.url));
        image.src = scene.url;
      });
      if (version !== requestVersion || !active || document.hidden ||
          (automatic && (paused || motion.matches))) return;
      const outgoing = layers[visibleLayer];
      const incomingIndex = (visibleLayer + 1) % layers.length;
      const incoming = layers[incomingIndex];
      outgoing.style.zIndex = "0";
      incoming.style.zIndex = "1";
      incoming.style.backgroundImage = "url(" + JSON.stringify(scene.url) + ")";
      incoming.style.backgroundPosition = scene.position;
      incoming.classList.add("is-visible");
      visibleLayer = incomingIndex;
      currentIndex = displayedIndex = index;
      nextIndex = (index + 1) % ANIME_BACKGROUNDS.length;
      document.body.dataset.animeScene = scene.id;
      label.textContent = scene.title;
      status.textContent = "";
      if (!motion.matches) {
        const fade = incoming.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1400, easing: "ease" });
        animation = fade;
        await fade.finished;
        if (animation === fade) animation = null;
      }
      if (version !== requestVersion) return;
      outgoing.classList.remove("is-visible");
    }
  } catch (error) {
    if (version !== requestVersion) return;
    paused = true;
    nextIndex = (index + 1) % ANIME_BACKGROUNDS.length;
    status.textContent = "Could not change background. Use Next to try another scene.";
    console.error("Anime background slideshow:", error);
  } finally {
    if (version === requestVersion) {
      loading = false;
      updateControls();
      schedule();
    }
  }
}

function suspend() {
  ++requestVersion;
  clearTimer();
  animation?.finish();
  animation = null;
  loading = false;
  updateControls();
}

function updateTheme() {
  const selected = document.body.dataset.theme === "gd-90s-anime";
  if (selected === active) return;
  suspend();
  active = selected;
  backdrop.hidden = controls.hidden = !active;
  if (active) {
    document.body.dataset.animeScene = ANIME_BACKGROUNDS[currentIndex].id;
    void showScene(currentIndex);
  } else {
    delete document.body.dataset.animeScene;
  }
}

pause.addEventListener("click", () => {
  if (motion.matches) return;
  paused = !paused;
  clearTimer();
  animation?.finish();
  updateControls();
  if (!paused && displayedIndex < 0) void showScene(currentIndex);
  else schedule();
});
next.addEventListener("click", () => {
  if (!loading) void showScene(nextIndex);
});
document.addEventListener("visibilitychange", () => {
  suspend();
  if (active && !document.hidden) void showScene(currentIndex);
});
motion.addEventListener("change", () => {
  if (motion.matches) animation?.finish();
  updateControls();
  schedule();
});
new MutationObserver(updateTheme).observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });
updateControls();
updateTheme();
