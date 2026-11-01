export const MAX_DURATION_MS = 24 * 60 * 60 * 1000;

export function parseDuration(minutes, seconds) {
  if (!/^\d+$/.test(minutes) || !/^\d+$/.test(seconds) || Number(seconds) > 59) {
    throw new Error("Enter whole minutes and seconds between 0 and 59.");
  }
  const duration = (Number(minutes) * 60 + Number(seconds)) * 1000;
  if (!Number.isSafeInteger(duration) || duration <= 0 || duration > MAX_DURATION_MS) {
    throw new Error("Set a timer between 1 second and 24 hours.");
  }
  return duration;
}

export function newTimer(durationMs) {
  if (!Number.isSafeInteger(durationMs) || durationMs <= 0 || durationMs > MAX_DURATION_MS) {
    throw new Error("Invalid timer duration.");
  }
  return { durationMs, remainingMs: durationMs, deadline: null, status: "idle", alertPending: false };
}

export function restoreTimer(value) {
  if (!value || !["idle", "running", "paused", "finished"].includes(value.status) ||
      typeof value.alertPending !== "boolean") throw new Error("Saved timer is invalid.");
  newTimer(value.durationMs);
  if (!Number.isFinite(value.remainingMs) || value.remainingMs < 0 || value.remainingMs > value.durationMs ||
      (value.status === "running" ? !Number.isFinite(value.deadline) || value.deadline <= 0 : value.deadline !== null) ||
      (value.status === "finished" && value.remainingMs !== 0) ||
      (value.status !== "finished" && (value.remainingMs === 0 || value.alertPending))) {
    throw new Error("Saved timer is invalid.");
  }
  return { ...value };
}

export function remainingTime(state, now) {
  return state.status === "running" ? Math.max(0, state.deadline - now) : state.remainingMs;
}

export function startTimer(state, now) {
  const remainingMs = state.status === "paused" ? state.remainingMs : state.durationMs;
  return { ...state, remainingMs, deadline: now + remainingMs, status: "running", alertPending: false };
}

export function updateTimer(state, now) {
  if (state.status !== "running" || remainingTime(state, now) > 0) return state;
  return { ...state, remainingMs: 0, deadline: null, status: "finished", alertPending: true };
}

export function pauseTimer(state, now) {
  const updated = updateTimer(state, now);
  if (updated.status !== "running") return updated;
  return { ...updated, remainingMs: remainingTime(updated, now), deadline: null, status: "paused" };
}

export function formatTime(milliseconds) {
  const total = Math.ceil(Math.max(0, milliseconds) / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total / 60) % 60;
  const seconds = String(total % 60).padStart(2, "0");
  return hours ? hours + ":" + String(minutes).padStart(2, "0") + ":" + seconds : minutes + ":" + seconds;
}
