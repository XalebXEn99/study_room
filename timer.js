import { parseDuration, newTimer, restoreTimer, remainingTime, startTimer, pauseTimer, updateTimer, formatTime } from "./timer-state.js";

const $ = id => document.getElementById(id);
const KEY = "study-room-timer";
const dialog = $("timer-finished");
const presets = Array.from(document.querySelectorAll(".timer-preset"));
const panel = document.querySelector(".timer-panel");
const floating = $("timer-floating");
let state = newTimer(25 * 60 * 1000);
let ownerId = window.studyRoomHistory?.ownerId || null;
const storageKey = () => window.studyRoomCloudConfigured ? KEY + ":" + (ownerId || "guest") : KEY;

new IntersectionObserver(([entry]) => {
  floating.classList.toggle("hidden", entry.isIntersecting && entry.intersectionRatio >= 1);
}, { threshold: [0, 1] }).observe($("timer-display"));
floating.addEventListener("click", () => {
  panel.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    block: "start"
  });
  $("timer-heading").focus({ preventScroll: true });
});

function message(text, error = false) {
  $("timer-status").textContent = text;
  $("timer-status").classList.toggle("error", error);
}

function persist() {
  if (state.status === "finished" && state.sessionId && state.historyOwner && !state.historyQueued) {
    try {
      window.studyRoomHistory.record({
        id: state.sessionId, startedAt: state.startedAt,
        finishedAt: state.finishedAt, durationMs: state.durationMs,
        technique: state.technique
      }, state.historyOwner);
      state = { ...state, historyQueued: true };
    } catch (error) {
      console.error("Could not save study history:", error.message);
      message("Time is up! Study history has not synced; sign in and retry.", true);
    }
  }
  try {
    localStorage.setItem(storageKey(), JSON.stringify(state));
  } catch (error) {
    console.error("Could not save timer:", error);
    message("Timer runs in this tab, but could not be saved for reload.", true);
  }
}

function render() {
  const time = formatTime(remainingTime(state, Date.now()));
  $("timer-display").textContent = time;
  $("timer-floating-display").textContent = time;
  $("timer-floating-status").textContent = {
    idle: "Ready", running: "Running", paused: "Paused", finished: "Time is up!"
  }[state.status];
  floating.dataset.status = state.status;
  const locked = state.status === "running" || state.status === "paused";
  $("timer-minutes").disabled = locked;
  $("timer-seconds").disabled = locked;
  $("timer-start").disabled = state.status === "running";
  $("timer-start").textContent = state.status === "paused" ? "Resume" : state.status === "finished" ? "Restart" : "Start";
  $("timer-pause").disabled = state.status !== "running";
  for (const preset of presets) {
    preset.disabled = locked;
    preset.setAttribute("aria-pressed", String(Number(preset.dataset.minutes) * 60000 === state.durationMs));
  }
  const selected = presets.find(preset => Number(preset.dataset.minutes) * 60000 === state.durationMs);
  $("timer-technique").textContent = selected ? selected.dataset.hint : "Your own session length.";
  if (state.status === "finished" && state.alertPending && !dialog.open) dialog.showModal();
}

function tick() {
  const updated = updateTimer(state, Date.now());
  if (updated !== state) {
    state = { ...updated, finishedAt: new Date(state.deadline).toISOString() };
    message("Time is up!");
    persist();
  }
  render();
}

$("timer-form").addEventListener("submit", event => {
  event.preventDefault();
  if (state.status === "running") {
    message("The timer is already running.");
    return;
  }
  try {
    if (state.status !== "paused") {
      const durationMs = parseDuration($("timer-minutes").value, $("timer-seconds").value);
      const preset = presets.find(item => Number(item.dataset.minutes) * 60000 === durationMs);
      state = {
        ...newTimer(durationMs),
        sessionId: crypto.randomUUID(), startedAt: new Date(Date.now()).toISOString(),
        historyOwner: ownerId,
        technique: preset?.firstElementChild?.textContent.trim() || "Custom"
      };
    }
    state = startTimer(state, Date.now());
    message("Running");
    persist();
    render();
  } catch (error) {
    message(error.message, true);
  }
});
$("timer-pause").addEventListener("click", () => {
  const updated = pauseTimer(state, Date.now());
  state = updated.status === "finished" ? { ...updated, finishedAt: new Date(state.deadline).toISOString() } : updated;
  message(state.status === "finished" ? "Time is up!" : "Paused");
  persist();
  render();
});
function reset(durationMs) {
  state = newTimer(durationMs);
  $("timer-minutes").value = String(Math.floor(state.durationMs / 60000));
  $("timer-seconds").value = String((state.durationMs / 1000) % 60);
  message("Ready");
  persist();
  render();
}
$("timer-reset").addEventListener("click", () => reset(state.durationMs));
for (const preset of presets) {
  preset.addEventListener("click", () => {
    try {
      reset(parseDuration(preset.dataset.minutes, "0"));
    } catch (error) {
      message(error.message, true);
    }
  });
}
$("timer-dismiss").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  state = { ...state, alertPending: false };
  persist();
});

function restore() {
  try {
    state = newTimer(25 * 60 * 1000);
    const saved = localStorage.getItem(storageKey());
    if (saved) state = restoreTimer(JSON.parse(saved));
    $("timer-minutes").value = String(Math.floor(state.durationMs / 60000));
    $("timer-seconds").value = String((state.durationMs / 1000) % 60);
    message(state.status === "running" ? "Running" : state.status === "paused" ? "Paused" : state.status === "finished" ? "Time is up!" : "Ready");
  } catch (error) {
    console.error("Could not restore timer:", error);
    message("The saved timer could not be restored. Set a new timer.", true);
  }
}
restore();
tick();
if (state.status === "finished" && !state.historyQueued && state.historyOwner === ownerId) persist();
window.addEventListener("study-room-account-change", () => {
  if (dialog.open) dialog.close();
  ownerId = window.studyRoomHistory?.ownerId || null;
  restore();
  tick();
  if (state.status === "finished" && !state.historyQueued && state.historyOwner === ownerId) persist();
});
setInterval(tick, 500);
document.addEventListener("visibilitychange", tick);
window.addEventListener("focus", tick);
window.addEventListener("pageshow", tick);
