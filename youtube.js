(function () {
  "use strict";

  // ===== YouTube panel — playlist / video embed =====
  // Paste any YouTube link (video, playlist, or both) and it plays inside
  // YouTube's own iframe player, so skippable ads keep their native Skip
  // button. (We can't remove or auto-skip ads: it's a cross-origin embed and
  // that would also break YouTube's Terms of Service.)

  var K = {
    url: "md-yt-url"
  };

  function read(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // ===== Element refs =====
  var player = document.getElementById("youtube-player");
  var pill = document.getElementById("youtube-pill");
  var collapseBtn = document.getElementById("yt-collapse-btn");
  var expandBtn = document.getElementById("yt-expand-btn");
  var clearBtn = document.getElementById("yt-clear-btn");
  var urlInput = document.getElementById("yt-url-input");
  var loadBtn = document.getElementById("yt-load-btn");
  var frameWrap = document.getElementById("yt-frame");
  var errEl = document.getElementById("yt-error");
  var pipBtn = document.getElementById("yt-pip-btn");
  var pipStatus = document.getElementById("yt-pip-status");
  var frameHome = frameWrap.parentNode;
  var pipWindow = null;
  var pipOpening = false;
  var apiPlayer = null;
  var apiReady = false;
  var apiLoads = new WeakMap();
  var generation = 0;
  var readyTimer = null;
  var activeEmbed = "";
  var transferState = null;

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
    var qs = "?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=" +
      encodeURIComponent(window.location.origin) + (autoplay ? "&autoplay=1" : "");
    if (list && id) return base + id + qs + "&listType=playlist&list=" + list;
    if (list) return base + "videoseries" + qs + "&listType=playlist&list=" + list;
    if (id) return base + id + qs;
    return null;
  }

  function loadPlayerApi(target) {
    if (target.YT && typeof target.YT.Player === "function") return Promise.resolve(target.YT);
    if (apiLoads.has(target)) return apiLoads.get(target);
    var promise = new Promise(function (resolve, reject) {
      var previous = target.onYouTubeIframeAPIReady;
      var script = target.document.createElement("script");
      var timer = setTimeout(function () { fail("YouTube's player API timed out."); }, 20000);
      function cleanup() {
        clearTimeout(timer);
        if (target.onYouTubeIframeAPIReady === ready) target.onYouTubeIframeAPIReady = previous;
      }
      function fail(message) {
        cleanup();
        script.remove();
        apiLoads.delete(target);
        reject(new Error(message));
      }
      function ready() {
        cleanup();
        resolve(target.YT);
        if (typeof previous === "function") previous();
      }
      target.onYouTubeIframeAPIReady = ready;
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = function () { fail("YouTube's player API could not load."); };
      target.document.head.append(script);
    });
    apiLoads.set(target, promise);
    return promise;
  }

  function updatePipControls() {
    var hasVideo = !frameWrap.classList.contains("hidden");
    pipBtn.classList.toggle("hidden", !hasVideo);
    pipBtn.disabled = pipOpening;
    pipBtn.textContent = pipWindow ? "Return" : "PiP";
    pipBtn.title = pipWindow ? "Return YouTube to page" : "Open YouTube picture-in-picture";
    pipBtn.setAttribute("aria-label", pipBtn.title);
    pipBtn.setAttribute("aria-pressed", String(!!pipWindow));
    pipStatus.classList.toggle("hidden", !pipWindow);
  }

  function playbackState() {
    if (!apiReady) return transferState;
    var videoId = new URL(apiPlayer.getVideoUrl()).searchParams.get("v");
    var time = apiPlayer.getCurrentTime();
    var list = new URL(activeEmbed).searchParams.get("list");
    var index = apiPlayer.getPlaylistIndex();
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId || "") || !Number.isFinite(time) || (list && index < 0)) {
      throw new Error("Play a video before opening picture-in-picture.");
    }
    var state = apiPlayer.getPlayerState();
    return {
      videoId: videoId, time: time, list: list, index: index,
      playing: state === 1 || state === 3,
      volume: apiPlayer.getVolume(), muted: apiPlayer.isMuted()
    };
  }

  function destroyPlayer() {
    generation++;
    clearTimeout(readyTimer);
    apiReady = false;
    if (apiPlayer) apiPlayer.destroy();
    apiPlayer = null;
  }

  function mountPlayer(target, snapshot) {
    destroyPlayer();
    transferState = snapshot;
    frameWrap.replaceChildren();
    if (target === window) frameHome.insertBefore(frameWrap, pipStatus);
    else target.document.body.append(frameWrap);
    var src = new URL(activeEmbed);
    if (snapshot) {
      src.pathname = "/embed/" + snapshot.videoId;
      src.searchParams.set("start", String(Math.floor(snapshot.time)));
      src.searchParams.set("autoplay", snapshot.playing ? "1" : "0");
    }
    var frame = target.document.createElement("iframe");
    frame.src = src.href;
    frame.title = "YouTube";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frameWrap.append(frame);
    frameWrap.classList.remove("hidden");
    setCompact(true);
    updatePipControls();
    var current = generation;
    loadPlayerApi(target).then(function (YT) {
      if (current !== generation || target.closed) return;
      readyTimer = setTimeout(function () {
        if (current === generation && !apiReady) {
          showError("PiP controls could not connect to YouTube. Check that YouTube is allowed, then reload the video.");
        }
      }, 20000);
      apiPlayer = new YT.Player(frame, {
        events: {
          onReady: function (event) {
            if (current !== generation) return;
            clearTimeout(readyTimer);
            apiReady = true;
            if (snapshot) {
              event.target.setVolume(snapshot.volume);
              if (snapshot.muted) event.target.mute();
              else event.target.unMute();
              if (snapshot.list) {
                var playlist = { list: snapshot.list, listType: "playlist", index: snapshot.index, startSeconds: snapshot.time };
                if (snapshot.playing) event.target.loadPlaylist(playlist);
                else event.target.cuePlaylist(playlist);
              } else {
                var video = { videoId: snapshot.videoId, startSeconds: snapshot.time };
                if (snapshot.playing) event.target.loadVideoById(video);
                else event.target.cueVideoById(video);
              }
            }
          },
          onError: function (event) {
            if (current !== generation) return;
            clearTimeout(readyTimer);
            showError("YouTube playback error " + event.data + ". Try opening this video on YouTube.");
          }
        }
      });
    }).catch(function (error) {
      if (current !== generation || target.closed) return;
      console.error("YouTube PiP setup failed:", error);
      showError("PiP controls unavailable: " + error.message);
    });
  }

  function returnToPage() {
    if (!pipWindow) return;
    var closing = pipWindow;
    var snapshot = transferState;
    try { snapshot = playbackState(); }
    catch (error) {
      console.error("Could not capture YouTube playback position:", error);
      showError("Could not read the latest video position. Returning to the last known position.");
    }
    pipWindow = null;
    mountPlayer(window, snapshot);
    if (!closing.closed) closing.close();
  }

  async function togglePip() {
    if (pipWindow) { returnToPage(); return; }
    if (!window.isSecureContext || !window.documentPictureInPicture ||
        typeof window.documentPictureInPicture.requestWindow !== "function") {
      showError("This PiP button needs a supported desktop Chrome or Edge browser over HTTPS or localhost. Otherwise use your browser's video PiP control.");
      return;
    }
    if (!apiReady) { showError("Wait for YouTube to load and start a video before opening PiP."); return; }
    var requested = null;
    var current = generation;
    pipOpening = true;
    updatePipControls();
    try {
      requested = await window.documentPictureInPicture.requestWindow({ width: 480, height: 300 });
      if (current !== generation) { requested.close(); return; }
      var snapshot = playbackState();
      requested.document.title = "YouTube - Study Room";
      var style = requested.document.createElement("style");
      style.textContent = "html,body{margin:0;width:100%;height:100%;background:#000;overflow:hidden}.yt-frame{width:100%;height:100%}.yt-frame iframe{display:block;width:100%;height:100%;border:0}.hidden{display:none!important}";
      requested.document.head.append(style);
      pipWindow = requested;
      requested.addEventListener("pagehide", function () {
        if (pipWindow === requested) returnToPage();
      }, { once: true });
      mountPlayer(requested, snapshot);
    } catch (error) {
      if (pipWindow) returnToPage();
      if (requested && !requested.closed) requested.close();
      console.error("Could not open YouTube PiP:", error);
      showError("Could not open picture-in-picture: " + error.message);
    } finally {
      pipOpening = false;
      updatePipControls();
    }
  }

  function load(autoplay) {
    var url = urlInput.value.trim();
    if (!url) { showError("Paste a YouTube link first."); return; }
    var embed = toEmbed(url, autoplay);
    if (!embed) { showError("That doesn't look like a YouTube link."); return; }
    write(K.url, url);
    activeEmbed = embed;
    mountPlayer(pipWindow || window, null);
  }

  function clearFrame() {
    destroyPlayer();
    var closing = pipWindow;
    pipWindow = null;
    if (closing && !closing.closed) closing.close();
    frameHome.insertBefore(frameWrap, pipStatus);
    frameWrap.replaceChildren();
    transferState = null;
    activeEmbed = "";
    frameWrap.classList.add("hidden");
    setCompact(false);
    updatePipControls();
  }

  function setCompact(compact) {
    var hasVideo = !frameWrap.classList.contains("hidden");
    compact = hasVideo && compact;
    player.classList.toggle("compact", compact);
    expandBtn.classList.toggle("hidden", !hasVideo);
    expandBtn.textContent = compact ? "\u2191" : "\u2193";
    expandBtn.title = compact ? "Expand YouTube settings" : "Show player only";
    expandBtn.setAttribute("aria-label", expandBtn.title);
    expandBtn.setAttribute("aria-expanded", String(!compact));
  }

  function openPanel() {
    player.classList.remove("hidden");
    pill.classList.add("hidden");
    pill.setAttribute("aria-expanded", "true");
    setCompact(!frameWrap.classList.contains("hidden"));
    if (urlInput && !urlInput.value) { var saved = read(K.url, ""); if (saved) urlInput.value = saved; }
  }
  function closePanel() {
    player.classList.add("hidden");
    pill.classList.remove("hidden");
    pill.setAttribute("aria-expanded", "false");
  }

  // ===== Wire controls =====
  pill.addEventListener("click", openPanel);
  collapseBtn.addEventListener("click", closePanel);
  expandBtn.addEventListener("click", function () { setCompact(!player.classList.contains("compact")); });
  clearBtn.addEventListener("click", clearFrame);
  pipBtn.addEventListener("click", togglePip);
  loadBtn.addEventListener("click", function () { load(true); });
  urlInput.addEventListener("keydown", function (e) { if (e.key === "Enter") load(true); });
  document.getElementById("yt-saved").addEventListener("change", function () {
    var link = document.getElementById("yt-saved-link");
    link.classList.toggle("hidden", !this.value);
    if (!this.value) { link.removeAttribute("href"); return; }
    link.href = this.value;
    urlInput.value = this.value;
    openPanel();
    load(true);
  });

  // ===== Init =====
  (function init() {
    var savedUrl = read(K.url, "");
    if (savedUrl && urlInput) urlInput.value = savedUrl;
    updatePipControls();
  })();
})();
