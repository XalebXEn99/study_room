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
  var apiKeyInput = document.getElementById("api-key-input");
  var saveApiKeyBtn = document.getElementById("save-api-key-btn");
  var settingsSavedMsg = document.getElementById("settings-saved-msg");
  var aiFloatBtn = document.getElementById("ai-float-btn");
  var aiModal = document.getElementById("ai-modal");
  var aiModalClose = document.getElementById("ai-modal-close");
  var aiSelectionPreview = document.getElementById("ai-selection-preview");
  var aiQuestionInput = document.getElementById("ai-question-input");
  var aiSendBtn = document.getElementById("ai-send-btn");
  var aiResponse = document.getElementById("ai-response");
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
  var selectedText = "";
  var nextId = 1;
  var isEditing = false;      // editor mode for the active tab (transient UI state)
  var saveTimer = null;

  function saveState() {
    try {
      localStorage.setItem("md-files", JSON.stringify(files.map(function (f) {
        return { id: f.id, name: f.name, raw: f.raw, theme: f.theme, libraryId: f.libraryId };
      })));
      localStorage.setItem("md-active-id", String(activeFileId || ""));
      document.getElementById("document-status").textContent = "";
    } catch (e) {
      console.error("Could not save local document drafts:", e);
      document.getElementById("document-status").textContent = "Local draft storage failed. Download your document to keep a copy.";
    }
  }

  function loadState() {
    try {
      var raw = localStorage.getItem("md-files");
      if (raw) {
        var parsed = JSON.parse(raw);
        parsed.forEach(function (f) {
          f.html = renderMarkdown(f.raw);
          if (validThemes.indexOf(f.theme) === -1) f.theme = lastSavedGlobal;
          files.push(f);
          if (f.id >= nextId) nextId = f.id + 1;
        });
      }
      var aid = localStorage.getItem("md-active-id");
      if (aid) activeFileId = parseInt(aid, 10);
    } catch (e) {}
  }

  function addFile(name, raw, libraryId) {
    flushActiveEdit();
    var id = nextId++;
    var html = renderMarkdown(raw);
    var active = getActiveFile();
    // New tabs inherit the active tab's theme; the first tab uses the last theme used
    files.push({ id: id, name: name, raw: raw, html: html, theme: active ? active.theme : lastAppliedTheme, libraryId: libraryId });
    activeFileId = id;
    saveState();
    renderTabs();
    showViewer();
    return id;
  }

  function removeFile(id) {
    flushActiveEdit();
    files = files.filter(function (f) { return f.id !== id; });
    if (activeFileId === id) {
      activeFileId = files.length > 0 ? files[files.length - 1].id : null;
    }
    saveState();
    renderTabs();
    if (activeFileId) {
      var f = getActiveFile();
      if (f) applyTheme(f.theme);
      showViewer();
    } else {
      applyTheme(lastAppliedTheme);
      createDoc();
    }
  }

  function switchFile(id) {
    flushActiveEdit();
    activeFileId = id;
    saveState();
    var f = getActiveFile();
    if (f) applyTheme(f.theme);
    renderTabs();
    showViewer();
  }

  function getActiveFile() {
    for (var i = 0; i < files.length; i++) {
      if (files[i].id === activeFileId) return files[i];
    }
    return null;
  }

  function renderTabs() {
    tabBar.innerHTML = "";
    files.forEach(function (f) {
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
    "default": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github.min.css",
    "office": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/atom-one-light.min.css",
    "sepia": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/atom-one-light.min.css",
    "notion": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github.min.css",
    "midnight": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/tokyo-night-dark.min.css",
    "nord": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/base16/nord.min.css",
    "dracula": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/dracula.min.css",
    "scifi": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/tokyo-night-dark.min.css",
    "synthwave": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/atom-one-dark.min.css",
    "pixel": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/arta.min.css",
    "terminal": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/monokai.min.css",
    "gameboy": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/arta.min.css"
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
    if (!themeMenu.classList.contains("hidden")) updateGroupStates(lastAppliedTheme);
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
    var reader = new FileReader();
    reader.onload = function (e) { addFile(file.name, e.target.result); };
    reader.readAsText(file);
  }

  // ===== AI: text selection =====
  document.addEventListener("mouseup", function (e) {
    setTimeout(function () {
      var sel = window.getSelection();
      var text = sel ? sel.toString().trim() : "";
      if (text.length > 2 && isInsideMarkdown(sel)) {
        selectedText = text;
        positionAiButton(e);
        aiFloatBtn.classList.remove("hidden");
      } else {
        aiFloatBtn.classList.add("hidden");
      }
    }, 10);
  });

  function isInsideMarkdown(sel) {
    if (!sel || !sel.anchorNode) return false;
    var node = sel.anchorNode;
    while (node) {
      if (node.classList && node.classList.contains("markdown-body")) return true;
      node = node.parentNode;
    }
    return false;
  }

  function positionAiButton(e) {
    var sel = window.getSelection();
    var rect = (sel && sel.rangeCount) ? sel.getRangeAt(0).getBoundingClientRect() : null;
    var btnW = aiFloatBtn.offsetWidth || 110;
    var btnH = aiFloatBtn.offsetHeight || 32;
    var x, y;
    if (rect && rect.width) {
      // Sit just below the highlight: the browser's native selection flyout
      // rides over the TOP edge, so staying underneath keeps this button clear.
      x = rect.left;
      y = rect.bottom + 8;
      if (x + btnW > window.innerWidth) x = window.innerWidth - btnW - 8;
      if (y + btnH > window.innerHeight) y = rect.top - btnH - 8;
    } else {
      x = e.clientX + 10;
      y = e.clientY + 15;
    }
    if (x < 8) x = 8;
    if (y < 8) y = 8;
    aiFloatBtn.style.left = x + "px";
    aiFloatBtn.style.top = y + "px";
  }

  // ===== AI: modal =====
  aiFloatBtn.addEventListener("click", function () {
    aiFloatBtn.classList.add("hidden");
    aiSelectionPreview.textContent = selectedText.length > 300
      ? selectedText.substring(0, 300) + "..." : selectedText;
    aiQuestionInput.value = "";
    aiResponse.className = "ai-response hidden";
    aiModal.classList.remove("hidden");
    setTimeout(function () { aiQuestionInput.focus(); }, 100);
  });

  aiModalClose.addEventListener("click", function () {
    aiModal.classList.add("hidden");
  });
  aiModal.addEventListener("click", function (e) {
    if (e.target === aiModal) aiModal.classList.add("hidden");
  });

  aiSendBtn.addEventListener("click", sendAiQuery);
  aiQuestionInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendAiQuery();
  });

  function sendAiQuery() {
    var question = aiQuestionInput.value.trim();
    if (!question) return;
    var apiKey = "";
    try { apiKey = localStorage.getItem("md-gemini-key") || ""; } catch (e) {}
    if (!apiKey) {
      aiResponse.textContent = "No API key set. Click the gear icon to add your free Gemini API key.";
      aiResponse.className = "ai-response error";
      aiResponse.classList.remove("hidden");
      return;
    }
    aiResponse.textContent = "Thinking...";
    aiResponse.className = "ai-response loading";
    aiResponse.classList.remove("hidden");
    aiSendBtn.disabled = true;

    var prompt = "You are a helpful assistant. The user has selected the following text from a Markdown document:\n\n---\n" +
      selectedText + "\n---\n\nThe user's question: " + question +
      "\n\nAnswer concisely and helpfully.";

    var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=" + apiKey;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
      })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      aiSendBtn.disabled = false;
      if (data.error) {
        aiResponse.textContent = "Error: " + data.error.message;
        aiResponse.className = "ai-response error";
      } else if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        aiResponse.textContent = data.candidates[0].content.parts[0].text;
        aiResponse.className = "ai-response";
      } else {
        aiResponse.textContent = "No response from API.";
        aiResponse.className = "ai-response error";
      }
      aiResponse.classList.remove("hidden");
    })
    .catch(function (err) {
      aiSendBtn.disabled = false;
      aiResponse.textContent = "Request failed: " + err.message;
      aiResponse.className = "ai-response error";
      aiResponse.classList.remove("hidden");
    });
  }

  // ===== Settings =====
  settingsBtn.addEventListener("click", function () {
    try { apiKeyInput.value = localStorage.getItem("md-gemini-key") || ""; } catch (e) {}
    settingsSavedMsg.classList.add("hidden");
    settingsModal.classList.remove("hidden");
  });
  settingsModalClose.addEventListener("click", function () {
    settingsModal.classList.add("hidden");
  });
  settingsModal.addEventListener("click", function (e) {
    if (e.target === settingsModal) settingsModal.classList.add("hidden");
  });
  saveApiKeyBtn.addEventListener("click", function () {
    var key = apiKeyInput.value.trim();
    try { localStorage.setItem("md-gemini-key", key); } catch (e) {}
    settingsSavedMsg.classList.remove("hidden");
    setTimeout(function () { settingsSavedMsg.classList.add("hidden"); }, 2000);
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
      f.raw = editorInput.value;
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
      f.raw = editorInput.value;
      f.html = renderMarkdown(f.raw);
      saveState();
    }
    showViewer();
  }

  function createDoc() {
    addFile("Untitled.md", "");
    enterEditor();
  }

  function downloadDoc() {
    var f = getActiveFile();
    if (!f) return;
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
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  editorInput.addEventListener("input", function () {
    var f = getActiveFile();
    if (!f || !isEditing) return;
    f.raw = editorInput.value;
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
      return { id: f.id, name: f.name, raw: f.raw, libraryId: f.libraryId };
    },
    open: addFile,
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
  loadState();
  var initialFile = getActiveFile();
  applyTheme(initialFile ? initialFile.theme : lastSavedGlobal);
  renderTabs();
  if (initialFile) {
    showViewer();
    if (!initialFile.raw) enterEditor();
  } else {
    createDoc();
  }
})();
