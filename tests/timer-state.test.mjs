import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_DURATION_MS, parseDuration, newTimer, restoreTimer, remainingTime,
  startTimer, pauseTimer, updateTimer, formatTime
} from "../timer-state.js";

test("accepts measurable durations between one second and 24 hours", () => {
  assert.equal(parseDuration("0", "1"), 1000);
  assert.equal(parseDuration("25", "0"), 1500000);
  assert.equal(parseDuration("1440", "0"), MAX_DURATION_MS);
  assert.equal(parseDuration("1439", "59"), MAX_DURATION_MS - 1000);
});

test("rejects empty, fractional, negative, zero and excessive duration inputs", () => {
  for (const [minutes, seconds] of [
    ["", "0"], ["0", ""], ["0", "0"], ["1.5", "0"], ["-1", "0"],
    ["1e2", "0"], ["0", "60"], ["1440", "1"], ["1441", "0"], ["0", "-1"]
  ]) {
    assert.throws(() => parseDuration(minutes, seconds));
  }
});

test("counts down from an absolute deadline rather than interval ticks", () => {
  const state = startTimer(newTimer(10000), 1000);
  assert.equal(state.deadline, 11000);
  assert.equal(remainingTime(state, 6500), 4500);
  assert.equal(remainingTime(state, 20000), 0);
});

test("pauses without losing the remainder and resumes from that remainder", () => {
  const running = startTimer(newTimer(10000), 1000);
  const paused = pauseTimer(running, 4000);
  assert.equal(paused.status, "paused");
  assert.equal(paused.remainingMs, 7000);
  assert.equal(paused.deadline, null);
  assert.equal(remainingTime(paused, 100000), 7000);
  const resumed = startTimer(paused, 20000);
  assert.equal(resumed.deadline, 27000);
  assert.equal(remainingTime(resumed, 21000), 6000);
});

test("finishes at the exact deadline with a pending overlay", () => {
  const state = startTimer(newTimer(1000), 1000);
  assert.equal(updateTimer(state, 1999), state);
  const finished = updateTimer(state, 2000);
  assert.equal(finished.status, "finished");
  assert.equal(finished.remainingMs, 0);
  assert.equal(finished.deadline, null);
  assert.equal(finished.alertPending, true);
  assert.equal(updateTimer(finished, 20000), finished);
});

test("pausing an expired timer finishes it instead of creating a zero-time pause", () => {
  const state = pauseTimer(startTimer(newTimer(1000), 1000), 3000);
  assert.equal(state.status, "finished");
  assert.equal(state.alertPending, true);
});

test("reload and prolonged background suspension preserve the original deadline", () => {
  const state = startTimer(newTimer(10000), 1000);
  const restored = restoreTimer(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.deadline, 11000);
  assert.equal(updateTimer(restored, 500000).status, "finished");
});

test("dismissed completion does not alert again after reload", () => {
  const finished = updateTimer(startTimer(newTimer(1000), 1000), 2000);
  const dismissed = restoreTimer({ ...finished, alertPending: false });
  assert.equal(updateTimer(dismissed, 999999).alertPending, false);
});

test("reset and restart restore the configured duration", () => {
  const finished = updateTimer(startTimer(newTimer(1000), 1000), 2000);
  const reset = newTimer(finished.durationMs);
  assert.equal(reset.remainingMs, 1000);
  assert.equal(reset.status, "idle");
  const restarted = startTimer(finished, 5000);
  assert.equal(restarted.deadline, 6000);
  assert.equal(restarted.alertPending, false);
});

test("invalid saved state is rejected explicitly", () => {
  const valid = newTimer(1000);
  for (const state of [
    null, {}, { ...valid, durationMs: 0 }, { ...valid, durationMs: MAX_DURATION_MS + 1 },
    { ...valid, remainingMs: -1 }, { ...valid, remainingMs: 2000 }, { ...valid, status: "unknown" },
    { ...valid, status: "running" }, { ...valid, status: "running", deadline: Infinity },
    { ...valid, status: "paused", deadline: 10000 }, { ...valid, status: "finished" },
    { ...valid, alertPending: true }, { ...valid, alertPending: "yes" }, { ...valid, remainingMs: 0 }
  ]) assert.throws(() => restoreTimer(state));
});

test("formats remaining seconds without showing zero early", () => {
  assert.equal(formatTime(1), "0:01");
  assert.equal(formatTime(1001), "0:02");
  assert.equal(formatTime(60000), "1:00");
  assert.equal(formatTime(1500000), "25:00");
  assert.equal(formatTime(3661000), "1:01:01");
  assert.equal(formatTime(MAX_DURATION_MS), "24:00:00");
  assert.equal(formatTime(0), "0:00");
});
