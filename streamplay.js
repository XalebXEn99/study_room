(function () {
  "use strict";

  const get = id => document.getElementById("streamplay-" + id);
  const panel = get("panel");
  const dialog = get("dialog");
  const video = get("video");
  const status = get("status");
  const playerStatus = get("player-status");
  const sources = get("source");
  const subtitles = get("subtitle");
  let selected = null;
  let resolved = null;
  let hls = null;
  let hlsPromise = null;
  let subtitleBlob = null;
  let playerGeneration = 0;
  let subtitleGeneration = 0;
  let selectionController = null;
  let searchController = null;
  let bridgeUrl = "";
  let bridgeToken = "";
  function connectionOrigin(input) {
    const url = new URL(input);
    const loopback = url.protocol === "http:" && url.hostname === "127.0.0.1" && !!url.port;
    if ((!loopback && url.protocol !== "https:") || url.username || url.password ||
        url.pathname !== "/" || url.search || url.hash) {
      throw new Error("Use an HTTPS origin or the helper's http://127.0.0.1:port address.");
    }
    return url.origin;
  }
  try {
    bridgeUrl = sessionStorage.getItem("study-room-local-helper") || localStorage.getItem("study-room-bridge-url") || "";
    bridgeToken = sessionStorage.getItem("study-room-bridge-token") || "";
  } catch (error) {
    message(status, "Browser storage is unavailable. Bridge settings will only last until reload.", true);
  }
  const pairing = new URLSearchParams(location.hash.slice(1));
  if (pairing.has("study-room-helper")) {
    try {
      const pairedOrigin = connectionOrigin(pairing.get("study-room-helper"));
      if (!pairedOrigin.startsWith("http://127.0.0.1:") || !/^[a-f0-9]{64}$/.test(pairing.get("token") || "")) {
        throw new Error("Invalid local helper pairing link.");
      }
      bridgeUrl = pairedOrigin;
      bridgeToken = pairing.get("token");
      try {
        sessionStorage.setItem("study-room-local-helper", bridgeUrl);
        sessionStorage.setItem("study-room-bridge-token", bridgeToken);
      } catch (error) {
        message(status, "Helper paired, but browser storage is unavailable. Re-pair after reload.", true);
      }
    } catch (error) { message(status, error.message, true); }
    finally { history.replaceState(null, "", location.pathname + location.search); }
  }
  get("bridge-url").value = bridgeUrl;
  get("bridge-token").value = bridgeToken;

  function bridgePath(path) {
    return new URL(path, bridgeUrl || location.origin).href;
  }

  function message(element, text, error) {
    element.textContent = text;
    element.classList.toggle("streamplay-error", !!error);
  }

  async function api(path, signal) {
    let response;
    try { response = await fetch(bridgePath("/api/" + path), {
      signal, headers: bridgeToken ? { Authorization: "Bearer " + bridgeToken } : {}
    }); }
    catch (error) {
      if (error.name === "AbortError") throw error;
      get("local-setup").open = true;
      throw new Error("Cannot reach the helper. Keep its terminal open and allow local-network access. Your browser or computer policy may block localhost connections.");
    }
    if (!(response.headers.get("content-type") || "").includes("application/json")) {
      get("local-setup").open = true;
      throw new Error("Run the command in Video setup first.");
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Bridge returned HTTP " + response.status);
    return data;
  }

  function options(select, entries) {
    select.replaceChildren(...entries.map(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      return option;
    }));
    select.disabled = !entries.length;
  }

  function clearSubtitles() {
    subtitleGeneration++;
    video.querySelectorAll("track").forEach(track => track.remove());
    if (subtitleBlob) URL.revokeObjectURL(subtitleBlob);
    subtitleBlob = null;
  }

  function stopVideo() {
    playerGeneration++;
    for (const option of sources.options) {
      option.textContent = option.textContent.replace("(playing)", "(played)");
    }
    video.onerror = null;
    video.onplaying = null;
    if (hls) hls.destroy();
    hls = null;
    video.pause();
    video.removeAttribute("src");
    video.load();
    clearSubtitles();
  }

  function cancelSelection() {
    if (selectionController) selectionController.abort();
    selectionController = new AbortController();
    return selectionController.signal;
  }

  function params() {
    const query = new URLSearchParams({ id: selected.id, type: selected.type });
    if (selected.type === "tv") {
      query.set("season", get("season").value);
      query.set("episode", get("episode").value);
    }
    return query;
  }

  function report(error) {
    if (error.name !== "AbortError") message(playerStatus, error.message, true);
  }

  async function loadEpisodes(signal) {
    get("resolve").disabled = true;
    options(get("episode"), []);
    const data = await api("details?" + new URLSearchParams({
      id: selected.id, type: "tv", season: get("season").value
    }), signal);
    if (signal.aborted) return;
    options(get("episode"), data.episodes.map(item => [item.number, item.number + ". " + item.name]));
    get("resolve").disabled = !data.episodes.length;
    message(playerStatus, data.episodes.length ? "Choose an episode, then find links." : "No episodes available.");
  }

  async function openTitle(item) {
    cancelSelection();
    const signal = selectionController.signal;
    stopVideo();
    selected = item;
    resolved = null;
    options(sources, []);
    options(subtitles, [["", "Off"]]);
    subtitles.disabled = true;
    get("title").textContent = item.title;
    get("retry").disabled = false;
    get("episodes").classList.toggle("hidden", item.type !== "tv");
    if (!dialog.open) dialog.showModal();
    try {
      if (item.type === "tv") {
        message(playerStatus, "Loading seasons...");
        options(get("season"), []);
        options(get("episode"), []);
        get("resolve").disabled = true;
        const data = await api("details?" + new URLSearchParams({ id: selected.id, type: "tv" }), signal);
        if (signal.aborted) return;
        options(get("season"), data.seasons.map(season => [season.number, season.name]));
        if (!data.seasons.length) throw new Error("No seasons available.");
        await loadEpisodes(signal);
      } else {
        await resolveTitle();
      }
    } catch (error) { report(error); }
  }

  async function resolveTitle() {
    const signal = cancelSelection();
    stopVideo();
    resolved = null;
    options(sources, []);
    options(subtitles, [["", "Off"]]);
    subtitles.disabled = true;
    message(playerStatus, "Resolving VidLink streams...");
    get("retry").disabled = true;
    get("resolve").disabled = true;
    try {
      const data = await api("resolve?" + params(), signal);
      if (signal.aborted) return;
      data.streams.forEach(stream => { stream.url = bridgePath(stream.url); });
      data.subtitles.forEach(subtitle => { subtitle.url = bridgePath(subtitle.url); });
      resolved = data;
      options(sources, data.streams.map((stream, index) => [index, stream.quality + " / " + stream.type + " (not checked)"]));
      const preferred = data.streams.findIndex(stream => /^720p?$/.test(stream.quality));
      if (preferred >= 0) sources.value = String(preferred);
      options(subtitles, [["", "Off"], ...data.subtitles.map((subtitle, index) => [index, subtitle.language])]);
      if (!data.streams.length) throw new Error("No stream links were returned.");
      await playSource();
    } catch (error) { report(error); }
    finally {
      if (!signal.aborted) {
        get("retry").disabled = false;
        get("resolve").disabled = selected.type === "tv" && !get("episode").value;
      }
    }
  }

  async function loadHls() {
    if (window.Hls) return window.Hls;
    if (!hlsPromise) {
      hlsPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = bridgePath("/hls.min.js");
        script.onload = () => window.Hls ? resolve(window.Hls) : reject(new Error("HLS player did not load."));
        script.onerror = () => { script.remove(); reject(new Error("HLS player missing. Run npm install on the bridge.")); };
        document.head.appendChild(script);
      }).catch(error => { hlsPromise = null; throw error; });
    }
    return hlsPromise;
  }

  async function playSource() {
    if (!resolved) return;
    stopVideo();
    subtitles.value = "";
    const generation = playerGeneration;
    const stream = resolved.streams[Number(sources.value)];
    const option = sources.selectedOptions[0];
    message(playerStatus, "Opening " + stream.quality + " stream...");
    function failed(text) {
      if (generation !== playerGeneration) return;
      option.textContent = stream.quality + " / " + stream.type + " (failed)";
      message(playerStatus, text + " Choose another link or refresh links.", true);
    }
    video.onerror = () => failed("Playback failed (network, source, or unsupported codec).");
    video.onplaying = () => {
      option.textContent = stream.quality + " / " + stream.type + " (playing)";
      message(playerStatus, "Playing " + stream.quality + ".");
    };
    try {
      if (["hls", "m3u8"].includes(stream.type.toLowerCase()) && !video.canPlayType("application/vnd.apple.mpegurl")) {
        const Hls = await loadHls();
        if (generation !== playerGeneration) return;
        if (!Hls.isSupported()) throw new Error("This browser does not support HLS playback.");
        hls = new Hls();
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            failed("HLS stream failed: " + data.details + ".");
            if (hls) hls.destroy();
            hls = null;
          }
        });
        hls.loadSource(stream.url);
        hls.attachMedia(video);
      } else video.src = stream.url;
      await video.play();
    } catch (error) {
      if (generation !== playerGeneration || error.name === "AbortError") return;
      if (error.name === "NotAllowedError") message(playerStatus, "Stream loaded. Press Play to start.");
      else failed(error.message);
    }
  }

  async function chooseSubtitle() {
    clearSubtitles();
    const generation = subtitleGeneration;
    if (subtitles.value === "" || !resolved) return;
    const subtitle = resolved.subtitles[Number(subtitles.value)];
    try {
      const response = await fetch(subtitle.url);
      if (!response.ok) throw new Error("Subtitle source returned HTTP " + response.status);
      const text = await response.text();
      if (text.length > 3 * 1024 * 1024) throw new Error("Subtitle file is too large.");
      if (generation !== subtitleGeneration) return;
      let vtt = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
      if (!vtt.startsWith("WEBVTT")) {
        if (subtitle.type !== "srt" && !/\d{2}:\d{2}:\d{2},\d{3}\s+-->/.test(vtt)) {
          throw new Error("Only SRT and WebVTT subtitles are supported.");
        }
        vtt = "WEBVTT\n\n" + vtt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
      }
      subtitleBlob = URL.createObjectURL(new Blob([vtt], { type: "text/vtt" }));
      const track = document.createElement("track");
      track.kind = "subtitles";
      track.label = subtitle.language;
      track.src = subtitleBlob;
      track.default = true;
      track.onerror = () => message(playerStatus, "Could not load subtitles.", true);
      video.appendChild(track);
      track.track.mode = "showing";
    } catch (error) {
      if (generation === subtitleGeneration) message(playerStatus, error.message, true);
    }
  }

  function showResults(items) {
    get("results").replaceChildren(...items.map(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "streamplay-result";
      const placeholder = document.createElement("span");
      placeholder.className = "streamplay-poster-placeholder";
      placeholder.textContent = "No poster";
      if (item.thumbnail) {
        const image = document.createElement("img");
        image.src = item.thumbnail;
        image.alt = "";
        image.loading = "lazy";
        image.referrerPolicy = "no-referrer";
        image.onerror = () => image.replaceWith(placeholder);
        button.appendChild(image);
      } else button.appendChild(placeholder);
      const label = document.createElement("span");
      label.textContent = item.title;
      const detail = document.createElement("small");
      detail.textContent = (item.year || "") + " / " + (item.type === "tv" ? "Series" : "Movie");
      button.append(label, detail);
      button.addEventListener("click", () => openTitle(item));
      return button;
    }));
  }

  function setOpen(open) {
    panel.classList.toggle("hidden", !open);
    get("toggle").classList.toggle("hidden", open);
    get("toggle").setAttribute("aria-expanded", String(open));
  }

  get("toggle").addEventListener("click", () => setOpen(panel.classList.contains("hidden")));
  get("copy-command").addEventListener("click", async () => {
    const command = get("launch-command");
    try {
      await navigator.clipboard.writeText(command.value);
      message(status, "Copied. Paste into PowerShell in any folder.");
    } catch (error) {
      command.focus();
      command.select();
      message(status, "Clipboard access was blocked. The command is selected; copy it manually.", true);
    }
  });
  get("connection").addEventListener("submit", async event => {
    event.preventDefault();
    try {
      const input = get("bridge-url").value.trim();
      let next = "";
      if (input) {
        next = connectionOrigin(input);
      }
      if (selectionController) selectionController.abort();
      if (searchController) searchController.abort();
      dialog.close();
      stopVideo();
      bridgeUrl = next;
      bridgeToken = get("bridge-token").value.trim();
      hlsPromise = null;
      try {
        if (bridgeUrl.startsWith("http://127.0.0.1:")) {
          sessionStorage.setItem("study-room-local-helper", bridgeUrl);
        } else {
          sessionStorage.removeItem("study-room-local-helper");
          localStorage.setItem("study-room-bridge-url", bridgeUrl);
        }
        sessionStorage.setItem("study-room-bridge-token", bridgeToken);
      } catch (error) {
        message(status, "Connected settings cannot be saved because browser storage is unavailable.", true);
        return;
      }
      await checkBridge();
    } catch (error) { message(status, error.message, true); }
  });
  get("collapse").addEventListener("click", () => { setOpen(false); get("toggle").focus(); });
  get("close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    if (selectionController) selectionController.abort();
    stopVideo();
    get("retry").disabled = false;
  });
  get("search").addEventListener("submit", async event => {
    event.preventDefault();
    if (searchController) searchController.abort();
    searchController = new AbortController();
    const signal = searchController.signal;
    showResults([]);
    message(status, "Searching...");
    try {
      const data = await api("search?q=" + encodeURIComponent(get("query").value.trim()), signal);
      if (signal.aborted) return;
      showResults(data.results);
      message(status, data.results.length ? data.results.length + " results." : "No matching titles.");
    } catch (error) { if (error.name !== "AbortError") message(status, error.message, true); }
  });
  get("demo").addEventListener("click", async () => {
    try {
      const item = await api("demo");
      showResults([item]);
      message(status, "Open-film playback test. Full search requires a TMDB token.");
    } catch (error) { message(status, error.message, true); }
  });
  get("season").addEventListener("change", () => {
    const signal = cancelSelection();
    stopVideo();
    resolved = null;
    options(sources, []);
    loadEpisodes(signal).catch(report);
  });
  get("episode").addEventListener("change", () => {
    cancelSelection();
    stopVideo();
    resolved = null;
    options(sources, []);
    get("resolve").disabled = false;
    message(playerStatus, "Click Find links for this episode.");
  });
  get("resolve").addEventListener("click", resolveTitle);
  get("retry").addEventListener("click", resolveTitle);
  sources.addEventListener("change", playSource);
  subtitles.addEventListener("change", chooseSubtitle);
  setOpen(false);
  async function checkBridge() {
    if (!bridgeUrl && location.hostname !== "127.0.0.1") {
      get("local-setup").open = true;
      message(status, "Follow Video setup to start watching.");
      return;
    }
    const data = await api("status");
    get("local-setup").open = false;
    message(status, data.searchConfigured ? "Search movies and series." : "Demo only. Add a TMDB token to enable search.");
  }
  checkBridge().catch(error => message(status, error.message, true));
})();
