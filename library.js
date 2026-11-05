import { YOUTUBE_COLLECTION, SPOTIFY_COLLECTION } from "./study-data.js";

const $ = id => document.getElementById(id);
const documents = window.studyRoomDocuments;
const DOCUMENT_DRAG_TYPE = "application/x-study-room-document";
const MAX_FILE_BYTES = 5 * 1024 * 1024;
let busy = false;

function message(text, error = false) {
  $("library-status").textContent = text;
  $("library-status").classList.toggle("error", error);
}

async function run(action) {
  if (busy) return;
  busy = true;
  message("");
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
  if (errors.length) message(errors.join(" "), true);
}

function icon(path) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "15");
  svg.setAttribute("height", "15");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.7");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
  shape.setAttribute("d", path);
  svg.append(shape);
  return svg;
}

function actionButton(label, path) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "library-action";
  button.title = label;
  button.setAttribute("aria-label", label);
  button.append(icon(path));
  return button;
}

const rows = new Map();
function createDocumentRow(entry) {
  const row = document.createElement("li");
  row.className = "library-row";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "library-file";
  button.draggable = true;
  button.addEventListener("click", () => run(() => documents.activate(entry.id)));
  button.addEventListener("dragstart", event => {
    event.dataTransfer.setData(DOCUMENT_DRAG_TYPE, String(entry.id));
    event.dataTransfer.effectAllowed = "copy";
  });
  const warning = document.createElement("span");
  warning.className = "library-unsaved";
  warning.setAttribute("role", "img");
  warning.setAttribute("aria-label", "Download a copy to save this file");
  warning.title = "Download a copy to save this file. Local drafts do not save back to your computer.";
  warning.append(icon("M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"));
  const rename = actionButton("Rename " + entry.name, "m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15v5z");
  rename.addEventListener("click", () => {
    const current = documents.list().find(file => file.id === entry.id);
    if (!current) {
      message("This document is no longer available.", true);
      return;
    }
    const form = document.createElement("form");
    form.className = "library-rename-form";
    const input = document.createElement("input");
    input.className = "library-rename-input";
    input.type = "text";
    input.value = current.name.replace(/\.(md|markdown|mdown|mkd)$/i, "");
    input.setAttribute("aria-label", "Filename for " + current.name);
    input.maxLength = 164;
    input.required = true;
    const confirm = actionButton("Confirm rename", "m5 12 4 4L19 6");
    confirm.type = "submit";
    const cancel = actionButton("Cancel rename", "m6 6 12 12M18 6 6 18");
    const finish = () => {
      row.replaceChildren(button, warning, rename);
      rename.focus();
    };
    cancel.addEventListener("click", finish);
    input.addEventListener("input", () => input.setCustomValidity(""));
    form.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        finish();
      }
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      try {
        documents.rename(entry.id, input.value);
        message("");
        finish();
      } catch (error) {
        console.error("Could not rename Markdown:", error);
        message(error.message || "Could not rename this file.", true);
        input.setCustomValidity(error.message || "Choose another filename.");
        input.reportValidity();
      }
    });
    form.append(input, confirm, cancel);
    row.replaceChildren(form);
    input.focus();
    input.select();
  });
  row.append(button, warning, rename);
  return { row, button, warning, rename };
}

function renderCollections() {
  const entries = documents.list();
  for (const [id, refs] of rows) {
    if (!entries.some(entry => entry.id === id)) {
      refs.row.remove();
      rows.delete(id);
    }
  }
  for (const [origin, id] of [["upload", "uploads"], ["created", "created"]]) {
    const collection = entries.filter(entry => entry.origin === origin);
    $("library-" + id + "-section").hidden = collection.length === 0;
    for (const entry of collection) {
      if (!rows.has(entry.id)) {
        const refs = createDocumentRow(entry);
        rows.set(entry.id, refs);
      }
      const refs = rows.get(entry.id);
      if (refs.origin !== origin) {
        refs.origin = origin;
        $("library-" + id).append(refs.row);
      }
      const { button, warning, rename } = refs;
      button.textContent = entry.name;
      button.title = "Open " + entry.name;
      button.setAttribute("aria-current", String(entry.active));
      warning.classList.toggle("hidden", !entry.needsDownload);
      rename.title = "Rename " + entry.name;
      rename.setAttribute("aria-label", rename.title);
    }
  }
}
window.addEventListener("study-room-documents-change", renderCollections);
renderCollections();
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
    if (!Array.from(event.dataTransfer.types).some(type => type === DOCUMENT_DRAG_TYPE || type === "Files")) return;
    event.preventDefault();
    event.stopPropagation();
    target.classList.add("library-drag-over");
    event.dataTransfer.dropEffect = "copy";
  }, true);
  target.addEventListener("dragleave", event => {
    if (!target.contains(event.relatedTarget)) target.classList.remove("library-drag-over");
  });
  target.addEventListener("drop", event => {
    if (!Array.from(event.dataTransfer.types).some(type => type === DOCUMENT_DRAG_TYPE || type === "Files")) return;
    event.preventDefault();
    event.stopPropagation();
    target.classList.remove("library-drag-over");
    const documentId = event.dataTransfer.getData(DOCUMENT_DRAG_TYPE);
    const files = Array.from(event.dataTransfer.files);
    run(() => documentId ? documents.activate(Number(documentId)) : openLocalFiles(files));
  }, true);
}
