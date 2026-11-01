import { MOTIVATION_QUOTES } from "./motivation-data.js";

const $ = id => document.getElementById(id);
const dialog = $("motivation-dialog");
const audio = $("motivation-audio");
const status = $("motivation-status");
const KEY = "study-room-encouragement-muted";
let muted = false;
let current = null;
let deck = [];
let playRequest = 0;
let quoteIndex = 0;

setInterval(() => {
  if (document.hidden) return;
  quoteIndex = (quoteIndex + 1) % MOTIVATION_QUOTES.length;
  $("study-quote").textContent = MOTIVATION_QUOTES[quoteIndex].text;
}, 12000);

function stopVoice() {
  playRequest++;
  audio.pause();
  audio.currentTime = 0;
}

function closeDialog() {
  stopVoice();
  dialog.close();
}

function voiceControls() {
  $("motivation-voice").textContent = muted ? "Voice off" : "Voice on";
  $("motivation-voice").setAttribute("aria-pressed", String(!muted));
  $("motivation-replay").disabled = muted;
}

function voiceError(error) {
  console.error("Encouragement voice:", error);
  status.textContent = "The voice could not play. Try Replay voice.";
}

async function playVoice() {
  if (muted || !dialog.open || !current) return;
  stopVoice();
  const request = playRequest;
  try {
    await audio.play();
    if (request === playRequest) status.textContent = "";
  } catch (error) {
    if (request !== playRequest || !dialog.open || muted) return;
    voiceError(error);
  }
}

function nextQuote() {
  stopVoice();
  if (!deck.length) {
    deck = [...MOTIVATION_QUOTES];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    if (current && deck[deck.length - 1].id === current.id) {
      [deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]];
    }
  }
  current = deck.pop();
  $("motivation-text").textContent = current.text;
  $("motivation-count").textContent = (MOTIVATION_QUOTES.length - deck.length) + " / " + MOTIVATION_QUOTES.length;
  audio.src = current.audio;
  audio.title = current.text + " | elevenlabs.io";
  status.textContent = "";
  void playVoice();
}

$("motivation-open").addEventListener("click", () => {
  if (!dialog.open) dialog.showModal();
  nextQuote();
});
$("motivation-close").addEventListener("click", closeDialog);
$("motivation-next").addEventListener("click", nextQuote);
$("motivation-replay").addEventListener("click", () => void playVoice());
$("motivation-voice").addEventListener("click", () => {
  muted = !muted;
  stopVoice();
  voiceControls();
  try {
    localStorage.setItem(KEY, String(muted));
    status.textContent = "";
  } catch (error) {
    console.error("Could not save encouragement voice preference:", error);
    status.textContent = "Voice preference could not be saved for your next visit.";
  }
  if (!muted) void playVoice();
});
dialog.addEventListener("close", stopVoice);
dialog.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeDialog();
  }
});
dialog.addEventListener("click", event => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog();
  }
});
audio.addEventListener("error", () => {
  if (dialog.open && !muted) voiceError(audio.error);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopVoice();
});

try {
  const saved = localStorage.getItem(KEY);
  if (saved !== null && saved !== "true" && saved !== "false") throw new Error("Invalid saved voice preference.");
  muted = saved === "true";
} catch (error) {
  console.error("Could not restore encouragement voice preference:", error);
  status.textContent = "Voice preference could not be restored. Use Voice on/off to choose.";
}
voiceControls();
