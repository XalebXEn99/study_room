(function () {
  "use strict";

  // ===== Mermaid (theme is (re)configured in the Theme section below) =====
  var currentMermaidTheme = null;

  function renderMermaidDiagrams() {
    var blocks = markdownOutput.querySelectorAll("code.language-mermaid");
    if (blocks.length === 0) return;
    blocks.forEach(function (block, i) {
      var pre = block.parentNode;
      var div = document.createElement("div");
      div.className = "mermaid";
      div.textContent = block.textContent;
      pre.replaceWith(div);
    });
    mermaid.run({ nodes: markdownOutput.querySelectorAll(".mermaid") }).catch(function () {});
  }

  marked.setOptions({
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
    breaks: false,
    gfm: true,
  });

  // ===== Math (KaTeX) =====
  // Math is lifted out of the Markdown before marked runs: marked would
  // otherwise consume the backslashes of \( \) and \[ \] as escape sequences,
  // HTML-escape "<" inside formulas, and italicise subscripts like x_i.
  // Code fences and inline code are lifted out first, so they are never
  // scanned for math.
  var CODE_TOKEN = "%%MDCODE%%";
  var MATH_TOKEN = "%%MDMATH%%";
  var FENCE_RE = /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[ \t]*$/gm;
  var INLINE_CODE_RE = /(`+)(?:[^\n`]|(?!\1)`)+\1/g;
  var MATH_RULES = [
    { display: true, re: /\\\[([\s\S]+?)\\\]/g },
    { display: true, re: /\$\$([\s\S]+?)\$\$/g },
    { display: false, re: /\\\(([\s\S]+?)\\\)/g },
    { display: false, re: /\$([^\s$][^$\n]*?[^\s$]|[^\s$])\$/g }
  ];

  function stashMatches(text, regex, bucket) {
    return text.replace(regex, function (match) {
      bucket.push(match);
      return CODE_TOKEN + (bucket.length - 1) + CODE_TOKEN;
    });
  }

  function restoreStashed(text, bucket) {
    return text.replace(new RegExp(CODE_TOKEN + "(\\d+)" + CODE_TOKEN, "g"), function (match, i) {
      return bucket[+i];
    });
  }

  function stashMath(text, bucket) {
    MATH_RULES.forEach(function (rule) {
      text = text.replace(rule.re, function (match, body) {
        var tex = String(body);
        if (!tex.trim() || tex.length > 8000) return match;
        if (!rule.display && /\n\s*\n/.test(tex)) return match;
        bucket.push({ tex: tex, display: rule.display });
        return MATH_TOKEN + (bucket.length - 1) + MATH_TOKEN;
      });
    });
    return text;
  }

  function renderMarkdown(raw) {
    var code = [];
    var math = [];
    var text = stashMatches(raw, FENCE_RE, code);
    text = stashMatches(text, INLINE_CODE_RE, code);
    text = stashMath(text, math);
    text = restoreStashed(text, code);
    return DOMPurify.sanitize(injectMathSpans(marked.parse(text), math));
  }

  function injectMathSpans(html, math) {
    return html.replace(new RegExp(MATH_TOKEN + "(\\d+)" + MATH_TOKEN, "g"), function (match, i) {
      var item = math[+i];
      if (!item) return match;
      var cls = item.display ? "math-block" : "math-inline";
      return '<span class="' + cls + '">' + escapeHtml(item.tex) + "</span>";
    });
  }

  function typesetMath(root) {
    if (typeof katex === "undefined") return;
    var nodes = root.querySelectorAll(".math-inline, .math-block");
    Array.prototype.forEach.call(nodes, function (el) {
      var tex = el.textContent;
      if (!tex.trim() || el.getAttribute("data-typeset")) return;
      el.setAttribute("data-typeset", "1");
      try {
        katex.render(tex, el, {
          displayMode: el.classList.contains("math-block"),
          throwOnError: false,
          strict: "ignore",
          output: "html"
        });
      } catch (err) {
        el.classList.add("math-error");
      }
    });
  }

  var tabBar = document.getElementById("tab-bar");
  var viewerScreen = document.getElementById("viewer-screen");
  var markdownOutput = document.getElementById("markdown-output");
  var themeToggle = document.getElementById("theme-toggle");
  var themeMenu = document.getElementById("theme-menu");
  var themeOptions = document.querySelectorAll(".theme-option");
  var settingsBtn = document.getElementById("settings-btn");
  var settingsModal = document.getElementById("settings-modal");
  var settingsModalClose = document.getElementById("settings-modal-close");
  var hljsLink = document.getElementById("hljs-theme");
  var addTabBtn = document.getElementById("add-tab-btn");
  var fileInput2 = document.getElementById("file-input-2");
  var createBtn = document.getElementById("create-btn");
  var editorBar = document.getElementById("editor-bar");
  var editModeBtn = document.getElementById("edit-mode-btn");
  var previewModeBtn = document.getElementById("preview-mode-btn");
  var editorHint = document.getElementById("editor-hint");
  var downloadBtn = document.getElementById("download-btn");
  var helpBtn = document.getElementById("help-btn");
  var editorInput = document.getElementById("editor-input");
  var helpModal = document.getElementById("help-modal");
  var helpModalClose = document.getElementById("help-modal-close");

  var files = [];
  var activeFileId = null;
  var nextId = 1;
  var isEditing = false;      // editor mode for the active tab (transient UI state)
  var saveTimer = null;
  var restoreFailed = false;

  function needsDownload(f) {
    return f.origin !== "starter" && (f.savedRaw !== f.raw || f.savedName !== f.name);
  }

  function notifyDocuments() {
    window.dispatchEvent(new Event("study-room-documents-change"));
  }

  function updateSource(f, raw) {
    if (f.origin === "starter" && raw !== f.raw) f.origin = "created";
    f.raw = raw;
  }

  function saveState() {
    if (window.studyRoomCloudConfigured) {
      notifyDocuments();
      return;
    }
    if (restoreFailed) {
      document.getElementById("document-status").textContent = "Stored drafts could not be restored and have not been overwritten. Download this document to keep a copy.";
      notifyDocuments();
      return;
    }
    try {
      localStorage.setItem("md-files", JSON.stringify(files.map(function (f) {
        return {
          id: f.id, name: f.name, raw: f.raw, theme: f.theme, libraryId: f.libraryId,
          origin: f.origin, closed: f.closed, savedRaw: f.savedRaw, savedName: f.savedName
        };
      })));
      localStorage.setItem("md-active-id", String(activeFileId || ""));
      document.getElementById("document-status").textContent = "";
    } catch (e) {
      console.error("Could not save local document drafts:", e);
      document.getElementById("document-status").textContent = "Local draft storage failed. Download your document to keep a copy.";
    }
    notifyDocuments();
  }

  function loadState() {
    try {
      var raw = localStorage.getItem("md-files");
      if (raw) {
        var parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || !parsed.every(function (f) {
          return f && Number.isSafeInteger(f.id) && f.id > 0 && typeof f.name === "string" && typeof f.raw === "string";
        })) throw new Error("Invalid saved Markdown documents.");
        parsed.forEach(function (f) {
          if (["starter", "created", "upload", "bundled"].indexOf(f.origin) === -1) {
            f.origin = f.libraryId ? "bundled" : /^Untitled(?:\.md)?$/i.test(f.name) ? (f.raw ? "created" : "starter") : "upload";
            // Older drafts have no original/download baseline; do not claim they are saved to disk.
            f.savedRaw = null;
            f.savedName = null;
          }
          f.closed = f.closed === true;
          f.html = renderMarkdown(f.raw);
          if (validThemes.indexOf(f.theme) === -1) f.theme = lastSavedGlobal;
          files.push(f);
          if (f.id >= nextId) nextId = f.id + 1;
        });
      }
      var aid = localStorage.getItem("md-active-id");
      if (aid) activeFileId = parseInt(aid, 10);
      if (!getActiveFile()) {
        var openFiles = files.filter(function (f) { return !f.closed; });
        activeFileId = openFiles.length ? openFiles[openFiles.length - 1].id : null;
      }
    } catch (e) {
      restoreFailed = true;
      console.error("Could not restore local document drafts:", e);
      document.getElementById("document-status").textContent = "Could not restore your local drafts.";
    }
  }

  function addFile(name, raw, libraryId, origin) {
    flushActiveEdit();
    var id = nextId++;
    var html = renderMarkdown(raw);
    var active = getActiveFile();
    // New tabs inherit the active tab's theme; the first tab uses the last theme used
    origin = libraryId ? "bundled" : origin || "upload";
    files.push({
      id: id, name: name, raw: raw, html: html, theme: active ? active.theme : lastAppliedTheme,
      libraryId: libraryId, origin: origin, closed: false,
      cloudId: window.crypto ? window.crypto.randomUUID() : null, version: 0,
      savedRaw: origin === "upload" || origin === "bundled" ? raw : null,
      savedName: origin === "upload" || origin === "bundled" ? name : null
    });
    activeFileId = id;
    saveState();
    renderTabs();
    showViewer();
    return id;
  }

  function removeFile(id) {
    flushActiveEdit();
    var closing = files.find(function (f) { return f.id === id; });
    if (!closing) return;
    if (closing.origin === "starter") files = files.filter(function (f) { return f.id !== id; });
    else closing.closed = true;
    if (activeFileId === id) {
      var openFiles = files.filter(function (f) { return !f.closed; });
      activeFileId = openFiles.length > 0 ? openFiles[openFiles.length - 1].id : null;
    }
    saveState();
    renderTabs();
    if (activeFileId) {
      var f = getActiveFile();
      if (f) applyTheme(f.theme);
      showViewer();
    } else {
      applyTheme(lastAppliedTheme);
      createDoc(true);
    }
  }

  function switchFile(id) {
    var target = files.find(function (f) { return f.id === id; });
    if (!target) throw new Error("This document is no longer available.");
    flushActiveEdit();
    target.closed = false;
    activeFileId = id;
    saveState();
    var f = getActiveFile();
    if (f) applyTheme(f.theme);
    renderTabs();
    showViewer();
  }

  function getActiveFile() {
    for (var i = 0; i < files.length; i++) {
      if (files[i].id === activeFileId && !files[i].closed) return files[i];
    }
    return null;
  }

  function renderTabs() {
    tabBar.innerHTML = "";
    files.forEach(function (f) {
      if (f.closed) return;
      var tab = document.createElement("button");
      tab.className = "tab" + (f.id === activeFileId ? " active" : "");
      tab.innerHTML = '<span class="tab-dot" style="background:' + (themeAccents[f.theme] || themeAccents["default"]) + '"></span>'
        + '<span class="tab-name">' + escapeHtml(f.name) + '</span><span class="tab-close">&times;</span>';
      tab.addEventListener("click", function (e) {
        if (e.target.classList.contains("tab-close")) {
          removeFile(f.id);
        } else {
          switchFile(f.id);
        }
      });
      tabBar.appendChild(tab);
    });
  }

  function showViewer() {
    var f = getActiveFile();
    if (!f) return;
    isEditing = false;
    editorInput.classList.add("hidden");
    markdownOutput.classList.remove("hidden");
    markdownOutput.innerHTML = f.html;
    typesetMath(markdownOutput);
    viewerScreen.classList.remove("hidden");
    setTimeout(renderMermaidDiagrams, 50);
    addTabBtn.classList.remove("hidden");
    refreshEditorBar();
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ===== Theme =====
  // Themes are per-tab: each file object carries its own `theme`, and the
  // body attribute / hljs stylesheet / mermaid config follow the active tab.
  var hljsThemes = {
    "default": "assets/vendor/highlight/styles/github.min.css",
    "office": "assets/vendor/highlight/styles/atom-one-light.min.css",
    "sepia": "assets/vendor/highlight/styles/atom-one-light.min.css",
    "notion": "assets/vendor/highlight/styles/github.min.css",
    "midnight": "assets/vendor/highlight/styles/tokyo-night-dark.min.css",
    "nord": "assets/vendor/highlight/styles/base16/nord.min.css",
    "dracula": "assets/vendor/highlight/styles/base16/dracula.min.css",
    "scifi": "assets/vendor/highlight/styles/tokyo-night-dark.min.css",
    "synthwave": "assets/vendor/highlight/styles/atom-one-dark.min.css",
    "pixel": "assets/vendor/highlight/styles/arta.min.css",
    "terminal": "assets/vendor/highlight/styles/monokai.min.css",
    "gameboy": "assets/vendor/highlight/styles/arta.min.css"
  };

  var mermaidThemes = {
    "default": "default", "office": "base", "sepia": "base", "notion": "default",
    "midnight": "dark", "nord": "dark", "dracula": "dark",
    "scifi": "dark", "synthwave": "dark",
    "pixel": "forest", "terminal": "dark", "gameboy": "forest"
  };

  // Accent color shown as a dot on each tab
  var themeAccents = {
    "default": "#0969da", "office": "#6b4c2a", "sepia": "#9c5c28", "notion": "#3183f8",
    "midnight": "#8b9dcf", "nord": "#88c0d0", "dracula": "#bd93f9",
    "scifi": "#00e5ff", "synthwave": "#ff6ec7",
    "pixel": "#f7d54a", "terminal": "#33ff66", "gameboy": "#0f3e1e"
  };

  var graphicThemes = {
    "gd-minimalism": { accent: "#292929", dark: false },
    "gd-maximalism": { accent: "#a51b61", dark: false },
    "gd-futuristic": { accent: "#03658c", dark: false },
    "gd-vector-art": { accent: "#2449a6", dark: false },
    "gd-collage-art": { accent: "#9b3431", dark: false },
    "gd-retro": { accent: "#8e3b23", dark: false },
    "gd-cyberpunk": { accent: "#49f4e3", dark: true },
    "gd-pop-art": { accent: "#ab164e", dark: false },
    "gd-glassmorphism": { accent: "#a5dcff", dark: true },
    "gd-clay": { accent: "#793d61", dark: false },
    "gd-pixel-art": { accent: "#ffe474", dark: true },
    "gd-editorial": { accent: "#8c292b", dark: false },
    "gd-y2k": { accent: "#57328e", dark: false },
    "gd-swiss": { accent: "#b3261e", dark: false },
    "gd-surreal": { accent: "#6d3983", dark: false },
    "gd-bohemian": { accent: "#854728", dark: false },
    "gd-victorian": { accent: "#70253e", dark: false },
    "gd-graffiti": { accent: "#c5ff57", dark: true },
    "gd-aurora": { accent: "#78efcf", dark: true },
    "gd-handwritten": { accent: "#28518d", dark: false },
    "gd-cityscape": { accent: "#923252", dark: false },
    "gd-90s-anime": { accent: "#e7b885", dark: true }
  };
  Object.keys(graphicThemes).forEach(function (theme) {
    var config = graphicThemes[theme];
    hljsThemes[theme] = config.dark ? hljsThemes.dracula : hljsThemes.default;
    mermaidThemes[theme] = config.dark ? "dark" : "default";
    themeAccents[theme] = config.accent;
  });
  var validThemes = Object.keys(hljsThemes);
  var lastAppliedTheme = "default";

  // Collapsible group sections in the theme popup
  var themeGroups = document.querySelectorAll(".theme-group");
  var groupOfTheme = {};
  themeGroups.forEach(function (group) {
    group.querySelectorAll(".theme-option").forEach(function (opt) {
      groupOfTheme[opt.getAttribute("data-theme")] = group;
    });
  });

  function updateGroupStates(theme) {
    var activeGroup = groupOfTheme[theme];
    if (!activeGroup) return;
    themeGroups.forEach(function (g) {
      g.classList.toggle("collapsed", g !== activeGroup);
    });
  }

  function applyTheme(theme) {
    if (validThemes.indexOf(theme) === -1) theme = "default";
    lastAppliedTheme = theme;
    document.body.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme-family", graphicThemes[theme] ? "graphic-design" : "legacy");
    hljsLink.href = hljsThemes[theme];
    themeOptions.forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-theme") === theme);
    });
    updateGroupStates(theme);
    var mTheme = mermaidThemes[theme] || "default";
    if (mTheme !== currentMermaidTheme) {
      currentMermaidTheme = mTheme;
      mermaid.initialize({ startOnLoad: false, theme: currentMermaidTheme, securityLevel: "strict" });
      if (getActiveFile()) {
        markdownOutput.innerHTML = getActiveFile().html;
        typesetMath(markdownOutput);
        renderMermaidDiagrams();
      }
    }
  }

  // Changes the theme of the active tab only; persisted per tab via saveState.
  function setTheme(theme) {
    var f = getActiveFile();
    if (f) {
      f.theme = theme;
      saveState();
    }
    try { localStorage.setItem("md-reader-theme", theme); } catch (e) {}
    applyTheme(theme);
    renderTabs();
  }

  themeToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    themeMenu.classList.toggle("hidden");
    // Re-sync: the active theme's group is always expanded when opening
    if (!themeMenu.classList.contains("hidden")) {
      updateGroupStates(lastAppliedTheme);
      document.querySelectorAll(".theme-family").forEach(function (family) { family.open = false; });
    }
  });

  document.querySelectorAll(".theme-family").forEach(function (family) {
    family.addEventListener("toggle", function () {
      if (!family.open) return;
      document.querySelectorAll(".theme-family").forEach(function (other) {
        if (other !== family) other.open = false;
      });
    });
  });

  document.querySelectorAll(".theme-group-header").forEach(function (header) {
    header.addEventListener("click", function (e) {
      e.stopPropagation();
      this.parentNode.classList.toggle("collapsed");
    });
  });

  themeOptions.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTheme(this.getAttribute("data-theme"));
      themeMenu.classList.add("hidden");
    });
  });

  document.addEventListener("click", function (e) {
    if (!themeMenu.contains(e.target) && e.target !== themeToggle) {
      themeMenu.classList.add("hidden");
    }
  });

  // ===== File upload =====
  function handleFile(file) {
    if (!file) return;
    if (!/\.(md|markdown|mdown|mkd)$/i.test(file.name) || file.size > 5 * 1024 * 1024) {
      document.getElementById("document-status").textContent = "Choose a Markdown file no larger than 5 MB.";
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) { addFile(file.name, e.target.result); };
    reader.onerror = function () {
      console.error("Could not read local Markdown:", reader.error);
      document.getElementById("document-status").textContent = "Could not read " + file.name + ". Please retry.";
    };
    reader.readAsText(file);
  }

  // ===== Settings =====
  settingsBtn.addEventListener("click", function () {
    settingsModal.classList.remove("hidden");
  });
  settingsModalClose.addEventListener("click", function () {
    settingsModal.classList.add("hidden");
  });
  settingsModal.addEventListener("click", function (e) {
    if (e.target === settingsModal) settingsModal.classList.add("hidden");
  });
  document.getElementById("reverse-text-btn").addEventListener("click", function () {
    document.getElementById("reverse-output").value = Array.from(document.getElementById("reverse-input").value).reverse().join("");
  });
  function clearReverseText() {
    document.getElementById("reverse-input").value = "";
    document.getElementById("reverse-output").value = "";
  }
  settingsModalClose.addEventListener("click", clearReverseText);
  settingsModal.addEventListener("click", function (event) {
    if (event.target === settingsModal) clearReverseText();
  });

  addTabBtn.addEventListener("click", function () { fileInput2.click(); });
  fileInput2.addEventListener("change", function () { handleFile(this.files[0]); this.value = ""; });

  // ===== Editor (create / edit Markdown with live LaTeX) =====
  function refreshEditorBar() {
    var f = getActiveFile();
    if (!f) { editorBar.classList.add("hidden"); return; }
    editorBar.classList.remove("hidden");
    editModeBtn.classList.toggle("active", isEditing);
    previewModeBtn.classList.toggle("active", !isEditing);
    editorHint.textContent = isEditing ? "Editing “" + f.name + "”" : "";
  }

  // Persist any in-progress typing from the textarea into the active file.
  function flushActiveEdit() {
    if (!isEditing) return;
    var f = getActiveFile();
    if (f) {
      updateSource(f, editorInput.value);
      f.html = renderMarkdown(f.raw);
      saveState();
    }
  }

  function enterEditor() {
    var f = getActiveFile();
    if (!f) return;
    isEditing = true;
    editorInput.value = f.raw;
    viewerScreen.classList.remove("hidden");
    addTabBtn.classList.remove("hidden");
    markdownOutput.classList.add("hidden");
    editorInput.classList.remove("hidden");
    refreshEditorBar();
    editorInput.focus();
  }

  function enterPreview() {
    var f = getActiveFile();
    if (!f) return;
    // Only flush the textarea while actually editing; otherwise it may be
    // empty (e.g. right after a reload) and clicking Preview would wipe the doc.
    if (isEditing) {
      updateSource(f, editorInput.value);
      f.html = renderMarkdown(f.raw);
      saveState();
    }
    showViewer();
  }

  function createDoc(starter) {
    addFile("Untitled.md", "", null, starter === true ? "starter" : "created");
    enterEditor();
  }

  function renameDoc(id, name) {
    var f = files.find(function (file) { return file.id === id; });
    if (!f) throw new Error("This document is no longer available.");
    var base = String(name).trim().replace(/\.(md|markdown|mdown|mkd)$/i, "").trim();
    if (!base || base === "." || base === ".." || /[\\/:*?"<>|\x00-\x1f]/.test(base) || /[. ]$/.test(base) || base.length > 160 ||
        /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(base)) {
      throw new Error("Enter a filename of 1-160 characters without reserved names or characters.");
    }
    flushActiveEdit();
    if (f.name === base + ".md") return;
    f.name = base + ".md";
    if (f.origin === "starter") f.origin = "created";
    saveState();
    renderTabs();
    refreshEditorBar();
  }

  function downloadDoc() {
    var f = getActiveFile();
    if (!f) return;
    flushActiveEdit();
    var src = isEditing ? editorInput.value : f.raw;
    var base = String(f.name || "document").replace(/\.md$/i, "").replace(/[\\/:*?"<>|]/g, "_");
    var blob = new Blob([src], { type: "text/markdown;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = (base || "document") + ".md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (f.origin === "starter") f.origin = "created";
    f.savedRaw = src;
    f.savedName = f.name;
    saveState();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  editorInput.addEventListener("input", function () {
    var f = getActiveFile();
    if (!f || !isEditing) return;
    updateSource(f, editorInput.value);
    notifyDocuments();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      f.html = renderMarkdown(f.raw);
      saveState();
    }, 400);
  });

  createBtn.addEventListener("click", createDoc);
  editModeBtn.addEventListener("click", enterEditor);
  previewModeBtn.addEventListener("click", enterPreview);
  downloadBtn.addEventListener("click", downloadDoc);
  helpBtn.addEventListener("click", function () { helpModal.classList.remove("hidden"); });
  helpModalClose.addEventListener("click", function () { helpModal.classList.add("hidden"); });
  helpModal.addEventListener("click", function (e) {
    if (e.target === helpModal) helpModal.classList.add("hidden");
  });

  var checklist = [];
  var checklistInput = document.getElementById("checklist-input");
  var checklistItems = document.getElementById("checklist-items");
  var checklistStatus = document.getElementById("checklist-status");

  function saveChecklist() {
    try {
      localStorage.setItem("study-room-checklist", JSON.stringify(checklist));
      checklistStatus.textContent = "";
    } catch (error) {
      console.error("Could not save study checklist:", error);
      checklistStatus.textContent = "Could not save your checklist on this device.";
    }
  }

  function renderChecklist() {
    checklistItems.replaceChildren();
    checklist.forEach(function (task) {
      var item = document.createElement("li");
      item.classList.toggle("completed", task.done);
      var label = document.createElement("label");
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", function () {
        task.done = checkbox.checked;
        item.classList.toggle("completed", task.done);
        saveChecklist();
      });
      var text = document.createElement("span");
      text.textContent = task.text;
      label.append(checkbox, text);
      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "checklist-remove";
      remove.textContent = "\u00d7";
      remove.setAttribute("aria-label", "Remove " + task.text);
      remove.addEventListener("click", function () {
        checklist = checklist.filter(function (entry) { return entry !== task; });
        saveChecklist();
        renderChecklist();
        checklistInput.focus();
      });
      item.append(label, remove);
      checklistItems.append(item);
    });
  }

  try {
    var storedChecklist = localStorage.getItem("study-room-checklist");
    if (storedChecklist) {
      var parsedChecklist = JSON.parse(storedChecklist);
      if (!Array.isArray(parsedChecklist) || !parsedChecklist.every(function (task) {
        return task && typeof task.text === "string" && task.text.trim() && typeof task.done === "boolean";
      })) throw new Error("Invalid saved study checklist.");
      checklist = parsedChecklist;
    }
  } catch (error) {
    console.error("Could not load study checklist:", error);
    checklistStatus.textContent = "Could not load your saved checklist.";
  }
  renderChecklist();
  document.getElementById("checklist-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var text = checklistInput.value.trim();
    if (!text) {
      checklistInput.setCustomValidity("Enter a study goal.");
      checklistInput.reportValidity();
      return;
    }
    checklist.push({ text: text, done: false });
    saveChecklist();
    renderChecklist();
    checklistInput.value = "";
    checklistInput.focus();
  });
  checklistInput.addEventListener("input", function () { checklistInput.setCustomValidity(""); });

  // ===== Init =====
  window.studyRoomDocuments = Object.freeze({
    active: function () {
      var f = getActiveFile();
      if (!f) return null;
      return { id: f.id, cloudId: f.cloudId, version: f.version || 0, name: f.name, raw: f.raw, libraryId: f.libraryId };
    },
    list: function () {
      return files.filter(function (f) { return f.origin === "upload" || f.origin === "created"; }).map(function (f) {
        return { id: f.id, name: f.name, origin: f.origin, needsDownload: needsDownload(f), active: f.id === activeFileId };
      });
    },
    snapshot: function () {
      return files.filter(function (f) { return f.origin !== "starter"; }).map(function (f) {
        return {
          id: f.id, cloudId: f.cloudId, version: f.version || 0,
          name: f.name, raw: f.raw, origin: f.origin === "bundled" ? "upload" : f.origin,
          theme: f.theme, closed: f.closed
        };
      });
    },
    acknowledge: function (cloudId, version) {
      var file = files.find(function (f) { return f.cloudId === cloudId; });
      if (file) file.version = version;
    },
    restoreRevision: function (cloudId, name, raw) {
      flushActiveEdit();
      var file = files.find(function (f) { return f.cloudId === cloudId; });
      if (!file) throw new Error("This document is no longer available.");
      file.name = name;
      file.raw = raw;
      file.html = renderMarkdown(raw);
      file.closed = false;
      activeFileId = file.id;
      saveState();
      renderTabs();
      showViewer();
    },
    replaceWorkspace: function (entries, activeCloudId) {
      clearTimeout(saveTimer);
      isEditing = false;
      files = entries.map(function (entry, index) {
        return {
          id: index + 1, cloudId: entry.id, version: entry.version,
          name: entry.name, raw: entry.raw, origin: entry.origin, closed: entry.closed,
          theme: validThemes.indexOf(entry.theme) === -1 ? lastSavedGlobal : entry.theme,
          html: renderMarkdown(entry.raw), savedRaw: null, savedName: null
        };
      });
      nextId = files.length + 1;
      var open = files.filter(function (f) { return !f.closed; });
      var selected = open.find(function (f) { return f.cloudId === activeCloudId; });
      activeFileId = selected ? selected.id : open.length ? open[open.length - 1].id : null;
      renderTabs();
      if (activeFileId) {
        applyTheme(getActiveFile().theme);
        showViewer();
      } else {
        createDoc(true);
      }
      notifyDocuments();
    },
    open: addFile,
    activate: switchFile,
    rename: renameDoc,
    activateLibraryFile: function (id) {
      var existing = files.find(function (f) { return f.libraryId === id; });
      if (!existing) return false;
      switchFile(existing.id);
      return true;
    }
  });
  var savedTheme = "default";
  try { savedTheme = localStorage.getItem("md-reader-theme") || "default"; } catch (e) {}
  var lastSavedGlobal = validThemes.indexOf(savedTheme) !== -1 ? savedTheme : "default";
  if (!window.studyRoomCloudConfigured) loadState();
  var initialFile = getActiveFile();
  applyTheme(initialFile ? initialFile.theme : lastSavedGlobal);
  renderTabs();
  if (initialFile) {
    showViewer();
    if (!initialFile.raw) enterEditor();
  } else {
    createDoc(true);
  }
})();
