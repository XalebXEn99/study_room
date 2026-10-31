(function () {
  "use strict";

  // ===== YouTube panel — playlist / video embed =====
  // Paste any YouTube link (video, playlist, or both) and it plays inside
  // YouTube's own iframe player, so skippable ads keep their native Skip
  // button. (We can't remove or auto-skip ads: it's a cross-origin embed and
  // that would also break YouTube's Terms of Service.)
  // A draggable icon sits to the right of the music note; the panel shares the
  // same look and drag behaviour as the Study Room player.

  var K = {
    url: "md-yt-url",
    pos: "md-yt-pos"
  };

  function read(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // ===== Element refs =====
  var player = document.getElementById("youtube-player");
  var pill = document.getElementById("youtube-pill");
  var handle = document.getElementById("yt-drag-handle");
  var collapseBtn = document.getElementById("yt-collapse-btn");
  var clearBtn = document.getElementById("yt-clear-btn");
  var urlInput = document.getElementById("yt-url-input");
  var loadBtn = document.getElementById("yt-load-btn");
  var frameWrap = document.getElementById("yt-frame");
  var errEl = document.getElementById("yt-error");

  function showError(msg) {
    errEl.textContent = msg;
    errEl.classList.remove("hidden");
    clearTimeout(showError._t);
    showError._t = setTimeout(function () { errEl.classList.add("hidden"); }, 4000);
  }

  // Turn any common YouTube URL into an embeddable src (video or playlist).
  function toEmbed(input, autoplay) {
    var s = String(input || "").trim();
    var id = "";
    var m = s.match(/(?:youtube\.com\/watch\?(?:[^#]*&)?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/|youtube\.com\/live\/)([A-Za-z0-9_-]{11})/);
    if (m) id = m[1];
    var list = "";
    var lm = s.match(/[?&]list=([A-Za-z0-9_-]+)/);
    if (lm) list = lm[1];
    var pm = s.match(/playlist\?list=([A-Za-z0-9_-]+)/);
    if (pm) list = pm[1];

    var base = "https://www.youtube.com/embed/";
    var qs = "?rel=0&modestbranding=1&playsinline=1" + (autoplay ? "&autoplay=1" : "");
    if (list && id) return base + id + qs + "&listType=playlist&list=" + list;
    if (list) return base + "videoseries" + qs + "&listType=playlist&list=" + list;
    if (id) return base + id + qs;
    return null;
  }

  function load(autoplay) {
    var url = urlInput.value.trim();
    if (!url) { showError("Paste a YouTube link first."); return; }
    var embed = toEmbed(url, autoplay);
    if (!embed) { showError("That doesn't look like a YouTube link."); return; }
    write(K.url, url);
    frameWrap.innerHTML =
      '<iframe src="' + embed + '" title="YouTube" frameborder="0" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
      'allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
    frameWrap.classList.remove("hidden");
  }

  function clearFrame() {
    frameWrap.innerHTML = "";
    frameWrap.classList.add("hidden");
  }

  // ===== Shared position (one saved point drives both the pill and the panel) =====
  function currentPos() {
    var raw = read(K.pos, "");
    if (raw) { try { var o = JSON.parse(raw); if (o && typeof o.x === "number") return o; } catch (e) {} }
    return null;
  }
  function savePos(x, y) { write(K.pos, JSON.stringify({ x: Math.round(x), y: Math.round(y) })); }

  // First-run anchor: in line, just to the right of the music note.
  function defaultPos() {
    var t = document.getElementById("spotify-pill") || document.getElementById("theme-toggle");
    var w = pill.offsetWidth || 34, h = pill.offsetHeight || 34, x, y;
    if (t) {
      var r = t.getBoundingClientRect();
      x = r.right + 6;
      if (x + w > window.innerWidth - 4) x = window.innerWidth - w - 6;
      y = r.top + (r.height - h) / 2;
    } else { x = window.innerWidth - w - 8; y = 8; }
    return { x: Math.max(4, x), y: Math.max(4, y) };
  }

  function isPlaced() { return player.style.left !== ""; }
  function placePill(x, y) {
    pill.style.transform = "none";
    pill.style.bottom = "auto";
    pill.style.left = x + "px";
    pill.style.top = y + "px";
  }
  function placePanel(x, y) {
    player.style.transform = "none";
    player.style.bottom = "auto";
    player.style.left = x + "px";
    player.style.top = y + "px";
  }

  function openPanel() {
    player.classList.remove("hidden");
    pill.classList.add("hidden");
    var p = currentPos() || defaultPos();
    var w = player.offsetWidth, h = player.offsetHeight;
    placePanel(
      Math.max(4, Math.min(p.x, window.innerWidth - w - 4)),
      Math.max(4, Math.min(p.y, window.innerHeight - h - 4))
    );
    if (urlInput && !urlInput.value) { var saved = read(K.url, ""); if (saved) urlInput.value = saved; }
  }
  function closePanel() {
    var r = player.getBoundingClientRect();
    player.classList.add("hidden");
    pill.classList.remove("hidden");
    var px = Math.max(4, Math.min(r.left, window.innerWidth - pill.offsetWidth - 4));
    var py = Math.max(4, Math.min(r.top, window.innerHeight - pill.offsetHeight - 4));
    placePill(px, py); savePos(px, py);
  }

  // ===== Panel drag =====
  var dragging = false, offX = 0, offY = 0;
  handle.addEventListener("pointerdown", function (e) {
    if (e.target.closest(".sp-btn, .sp-bar-controls, iframe")) return;
    dragging = true;
    player.classList.add("dragging");
    try { handle.setPointerCapture(e.pointerId); } catch (err) {}
    var r = player.getBoundingClientRect();
    if (!isPlaced()) placePanel(r.left, r.top);
    offX = e.clientX - r.left; offY = e.clientY - r.top;
    e.preventDefault();
  });
  handle.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var x = e.clientX - offX, y = e.clientY - offY;
    var w = player.offsetWidth, h = player.offsetHeight;
    x = Math.max(4, Math.min(x, window.innerWidth - w - 4));
    y = Math.max(4, Math.min(y, window.innerHeight - h - 4));
    placePanel(x, y);
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false; player.classList.remove("dragging");
    var r = player.getBoundingClientRect(); savePos(r.left, r.top);
  }
  handle.addEventListener("pointerup", endDrag);
  handle.addEventListener("pointercancel", endDrag);

  // ===== Pill drag (a tap opens the panel; a drag repositions it) =====
  var pillDragging = false, pillMoved = false, pOffX = 0, pOffY = 0, pStartX = 0, pStartY = 0;
  pill.addEventListener("pointerdown", function (e) {
    pillDragging = true; pillMoved = false;
    pStartX = e.clientX; pStartY = e.clientY;
    try { pill.setPointerCapture(e.pointerId); } catch (err) {}
    var r = pill.getBoundingClientRect();
    pOffX = e.clientX - r.left; pOffY = e.clientY - r.top;
    e.preventDefault();
  });
  pill.addEventListener("pointermove", function (e) {
    if (!pillDragging) return;
    if (Math.abs(e.clientX - pStartX) + Math.abs(e.clientY - pStartY) > 5) pillMoved = true;
    if (!pillMoved) return;
    pill.classList.add("dragging");
    var x = e.clientX - pOffX, y = e.clientY - pOffY;
    var w = pill.offsetWidth, h = pill.offsetHeight;
    x = Math.max(4, Math.min(x, window.innerWidth - w - 4));
    y = Math.max(4, Math.min(y, window.innerHeight - h - 4));
    placePill(x, y);
  });
  function pillEnd() {
    if (!pillDragging) return;
    pillDragging = false; pill.classList.remove("dragging");
    if (!pillMoved) { openPanel(); return; }
    var r = pill.getBoundingClientRect(); savePos(r.left, r.top);
  }
  pill.addEventListener("pointerup", pillEnd);
  pill.addEventListener("pointercancel", pillEnd);

  // ===== Wire controls =====
  collapseBtn.addEventListener("click", closePanel);
  clearBtn.addEventListener("click", clearFrame);
  loadBtn.addEventListener("click", function () { load(true); });
  urlInput.addEventListener("keydown", function (e) { if (e.key === "Enter") load(true); });

  // ===== Init =====
  (function init() {
    var p0 = currentPos() || defaultPos();
    placePill(p0.x, p0.y); savePos(p0.x, p0.y);
    var savedUrl = read(K.url, "");
    if (savedUrl && urlInput) urlInput.value = savedUrl;
  })();
})();
