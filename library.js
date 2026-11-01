import { STUDY_NOTES, BOOK_DOWNLOAD, YOUTUBE_COLLECTION, SPOTIFY_COLLECTION } from "./study-data.js";

const $ = id => document.getElementById(id);
const documents = window.studyRoomDocuments;
const DRAG_TYPE = "application/x-study-room-note";
const MAX_FILE_BYTES = 5 * 1024 * 1024;
let busy = false;

function message(text, error = false) {
  $("library-status").textContent = text;
  $("library-status").classList.toggle("error", error);
}

async function run(action) {
  if (busy) {
    message("Please wait for the current file to open.");
    return;
  }
  busy = true;
  $("library-panel").setAttribute("aria-busy", "true");
  try {
    await action();
  } catch (error) {
    console.error("Study library:", error);
    message(error.message || "The file could not be opened.", true);
  } finally {
    busy = false;
    $("library-panel").setAttribute("aria-busy", "false");
  }
}

async function openNote(id) {
  const note = STUDY_NOTES.find(item => item.id === id);
  if (!note) throw new Error("Choose a Markdown file from the study library.");
  if (documents.activateLibraryFile(note.id)) {
    message("Opened your existing draft of " + note.name + ".");
    return;
  }
  message("Opening " + note.name + "...");
  const response = await fetch(note.url, { cache: "no-cache", signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error("Could not load " + note.name + " (HTTP " + response.status + "). Please retry.");
  const raw = await response.text();
  documents.open(note.name, raw, note.id);
  message("Opened " + note.name + ". Edits stay on this device; use Download to keep a copy.");
}

async function openLocalFiles(files) {
  if (!files.length) throw new Error("Drop a study note from the library or a Markdown file from your computer.");
  const errors = [];
  for (const file of files) {
    if (!/\.(md|markdown|mdown|mkd)$/i.test(file.name)) {
      errors.push(file.name + ": not a Markdown file.");
    } else if (file.size > MAX_FILE_BYTES) {
      errors.push(file.name + ": exceeds the 5 MB limit.");
    } else {
      documents.open(file.name, await file.text());
    }
  }
  message(errors.length ? errors.join(" ") : "Local Markdown files opened. Edits stay on this device.", errors.length > 0);
}

for (const note of STUDY_NOTES) {
  const item = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "library-file";
  button.textContent = note.title;
  button.title = "Open " + note.name;
  button.draggable = true;
  button.addEventListener("click", () => run(() => openNote(note.id)));
  button.addEventListener("dragstart", event => {
    event.dataTransfer.setData(DRAG_TYPE, note.id);
    event.dataTransfer.effectAllowed = "copy";
  });
  item.append(button);
  $("library-notes").append(item);
}

const book = $("book-download");
book.href = BOOK_DOWNLOAD.url;
book.download = BOOK_DOWNLOAD.name;

for (const [id, collection] of [["yt-saved", YOUTUBE_COLLECTION], ["sp-saved", SPOTIFY_COLLECTION]]) {
  for (const item of collection) {
    const option = document.createElement("option");
    option.value = item.url;
    option.textContent = item.title;
    $(id).append(option);
  }
}

$("library-toggle").addEventListener("click", () => {
  const expanded = $("library-toggle").getAttribute("aria-expanded") !== "true";
  $("library-toggle").setAttribute("aria-expanded", String(expanded));
  $("library-body").classList.toggle("hidden", !expanded);
  $("library-caret").textContent = expanded ? "\u25be" : "\u25b8";
});
$("library-local-input").addEventListener("change", event => {
  const files = Array.from(event.target.files);
  event.target.value = "";
  run(() => openLocalFiles(files));
});
$("library-drop").addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    $("library-local-input").click();
  }
});
for (const target of [$("library-panel"), document.querySelector(".app-wrapper")]) {
  target.addEventListener("dragover", event => {
    if (!event.dataTransfer.types.some(type => type === DRAG_TYPE || type === "Files")) return;
    event.preventDefault();
    event.stopPropagation();
    target.classList.add("library-drag-over");
    event.dataTransfer.dropEffect = "copy";
  }, true);
  target.addEventListener("dragleave", event => {
    if (!target.contains(event.relatedTarget)) target.classList.remove("library-drag-over");
  });
  target.addEventListener("drop", event => {
    if (!event.dataTransfer.types.some(type => type === DRAG_TYPE || type === "Files")) return;
    event.preventDefault();
    event.stopPropagation();
    target.classList.remove("library-drag-over");
    const id = event.dataTransfer.getData(DRAG_TYPE);
    const files = Array.from(event.dataTransfer.files);
    run(() => id ? openNote(id) : openLocalFiles(files));
  }, true);
}
