(function () {
  "use strict";

  // ===== YouTube panel — playlist / video embed =====
  // Paste any YouTube link (video, playlist, or both) and it plays inside
  // YouTube's own iframe player, so skippable ads keep their native Skip
  // button. (We can't remove or auto-skip ads: it's a cross-origin embed and
  // that would also break YouTube's Terms of Service.)
  // The panel stays anchored in the bottom-right corner.

  var K = {
    url: "md-yt-url"
  };

  function read(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // ===== Element refs =====
  var player = document.getElementById("youtube-player");
  var pill = document.getElementById("youtube-pill");
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

  function openPanel() {
    player.classList.remove("hidden");
    pill.classList.add("hidden");
    if (urlInput && !urlInput.value) { var saved = read(K.url, ""); if (saved) urlInput.value = saved; }
  }
  function closePanel() {
    player.classList.add("hidden");
    pill.classList.remove("hidden");
  }

  // ===== Wire controls =====
  pill.addEventListener("click", openPanel);
  collapseBtn.addEventListener("click", closePanel);
  clearBtn.addEventListener("click", clearFrame);
  loadBtn.addEventListener("click", function () { load(true); });
  urlInput.addEventListener("keydown", function (e) { if (e.key === "Enter") load(true); });

  // ===== Init =====
  (function init() {
    var savedUrl = read(K.url, "");
    if (savedUrl && urlInput) urlInput.value = savedUrl;
  })();
})();
