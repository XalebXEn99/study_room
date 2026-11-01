(function () {
  "use strict";

  // ===== Study Room — Spotify full playback =====
  // Self-contained: OAuth (PKCE, no secret) + Web Playback SDK device +
  // a sidebar panel that plays a pasted Spotify link. Premium only.
  // Everything is client-side; tokens live in localStorage like the Gemini key.

  var AUTH_URL = "https://accounts.spotify.com/authorize";
  var TOKEN_URL = "https://accounts.spotify.com/api/token";
  var API = "https://api.spotify.com/v1";
  var SCOPES = [
    "streaming", "user-read-email", "user-read-private",
    "user-read-playback-state", "user-modify-playback-state",
    "playlist-read-private", "playlist-read-collaborative", "user-library-read"
  ].join(" ");

  var K = {
    clientId: "md-spotify-client-id",
    token: "md-spotify-token",
    verifier: "md-spotify-verifier",
    state: "md-spotify-state",
    url: "md-spotify-url",
    collapsed: "md-spotify-collapsed"
  };

  function read(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function erase(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function sesGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sesSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function sesDel(k) { try { sessionStorage.removeItem(k); } catch (e) {} }

  // The Client ID is a PUBLIC identifier (PKCE apps ship it in the browser URL),
  // so it's baked in as the default. Settings can still override it.
  var DEFAULT_CLIENT_ID = "2d45e67f5aba4629814f8f1cd73f84f0";
  function getClientId() { return (read(K.clientId, DEFAULT_CLIENT_ID) || DEFAULT_CLIENT_ID).trim(); }
  function redirectUri() { return window.location.origin + window.location.pathname; }

  function loadToken() {
    try { var t = JSON.parse(read(K.token, "null")); return t && t.access_token ? t : null; } catch (e) { return null; }
  }
  function saveToken(t) { write(K.token, JSON.stringify(t)); }

  // ===== Element refs =====
  var player = document.getElementById("spotify-player");
  var pill = document.getElementById("spotify-pill");
  var actionsEl = document.getElementById("sp-actions");
  var logoutBtn = document.getElementById("sp-logout-btn");
  var collapseBtn = document.getElementById("sp-collapse-btn");
  var expandBtn = document.getElementById("sp-expand-btn");
  var authView = document.getElementById("sp-auth");
  var authHint = document.getElementById("sp-auth-hint");
  var loginBtn = document.getElementById("sp-login-btn");
  var urlInput = document.getElementById("sp-url-input");
  var loadBtn = document.getElementById("sp-load-btn");
  var npBar = document.getElementById("sp-nowplaying");
  var coverEl = document.getElementById("sp-cover");
  var npTitle = document.getElementById("sp-np-title");
  var npArtist = document.getElementById("sp-np-artist");
  var playBtn = document.getElementById("sp-play");
  var prevBtn = document.getElementById("sp-prev");
  var nextBtn = document.getElementById("sp-next");
  var volEl = document.getElementById("sp-volume");
  var errEl = document.getElementById("sp-error");
  var playlists = document.getElementById("sp-playlists");

  var deviceId = null;
  var sdkReady = false;
  var spotifyObj = null;   // the Spotify.Player instance
  var premiumOk = false;
  var isPlaying = false;

  function showError(msg) {
    errEl.textContent = msg;
    errEl.classList.remove("hidden");
    clearTimeout(showError._t);
    showError._t = setTimeout(function () { errEl.classList.add("hidden"); }, 4000);
  }

  // ===== PKCE helpers =====
  function randStr(n) {
    var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", s = "";
    for (var i = 0; i < n; i++) s += c.charAt(Math.floor(Math.random() * c.length));
    return s;
  }
  function b64urlFromBytes(bytes) {
    var s = "";
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function challengeFor(verifier) {
    var data = new TextEncoder().encode(verifier);
    return crypto.subtle.digest("SHA-256", data).then(function (buf) {
      return b64urlFromBytes(new Uint8Array(buf));
    });
  }

  // ===== Auth: login =====
  function login() {
    var cid = getClientId();
    if (!cid) { showError("Spotify is not configured."); return; }
    var verifier = randStr(64);
    var state = randStr(16);
    sesSet(K.verifier, verifier);
    sesSet(K.state, state);
    challengeFor(verifier).then(function (challenge) {
      var p = new URLSearchParams({
        client_id: cid,
        response_type: "code",
        redirect_uri: redirectUri(),
        scope: SCOPES,
        state: state,
        code_challenge_method: "S256",
        code_challenge: challenge
      });
      window.location.assign(AUTH_URL + "?" + p.toString());
    }).catch(function () { showError("Could not start login (needs a secure https or localhost origin)."); });
  }

  function formBody(body) {
    return new URLSearchParams(body).toString();
  }

  function exchangeCode(code) {
    var cid = getClientId();
    return fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri(),
        client_id: cid,
        code_verifier: sesGet(K.verifier) || ""
      })
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); });
  }

  function doRefresh(refreshToken) {
    var cid = getClientId();
    return fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({ grant_type: "refresh_token", refresh_token: refreshToken, client_id: cid })
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); });
  }

  // Returns a promise of a valid access token (refreshing if near expiry).
  function getToken() {
    var t = loadToken();
    if (!t) return Promise.reject(new Error("not-authenticated"));
    if (Date.now() < t.expires_at - 60000) return Promise.resolve(t.access_token);
    if (!t.refresh_token) return Promise.reject(new Error("session-expired"));
    return doRefresh(t.refresh_token).then(function (res) {
      if (!res.ok || !res.j.access_token) { clearAuth(); throw new Error("refresh-failed"); }
      saveToken({
        access_token: res.j.access_token,
        refresh_token: res.j.refresh_token || t.refresh_token,
        expires_at: Date.now() + res.j.expires_in * 1000
      });
      return res.j.access_token;
    });
  }

  function api(path, opts) {
    opts = opts || {};
    return getToken().then(function (tok) {
      opts.headers = opts.headers || {};
      opts.headers["Authorization"] = "Bearer " + tok;
      return fetch(API + path, opts);
    });
  }

  function clearAuth() {
    erase(K.token);
    premiumOk = false;
    deviceId = null;
  }

  // ===== Web Playback SDK =====
  window.onSpotifyWebPlaybackSDKReady = function () { sdkReady = true; maybeCreatePlayer(); };

  function maybeCreatePlayer() {
    if (!sdkReady || spotifyObj || typeof Spotify === "undefined") return;
    if (!loadToken()) return;
    spotifyObj = new Spotify.Player({
      name: "Study Room",
      getOAuthToken: function (cb) { getToken().then(cb).catch(function () {}); },
      volume: parseFloat(volEl.value || "0.6")
    });
    spotifyObj.addListener("ready", function (d) { deviceId = d.device_id; refreshUI(); });
    spotifyObj.addListener("not_ready", function () { deviceId = null; });
    spotifyObj.addListener("player_state_changed", renderNowPlaying);
    spotifyObj.addListener("initialization_error", function (e) {
      if (/Premium/i.test(e.message || "")) premiumOk = false, refreshUI();
    });
    spotifyObj.connect().then(function (connected) {
      if (!connected) showError("Could not start the player. It requires Spotify Premium.");
    }).catch(function () {});
  }

  function playContext(uri, kind) {
    maybeCreatePlayer();
    if (!deviceId) { showError("Player is still starting — try again in a second."); return; }
    var body = kind === "track" ? JSON.stringify({ uris: [uri] }) : JSON.stringify({ context_uri: uri });
    api("/me/player/play?device_id=" + encodeURIComponent(deviceId), {
      method: "PUT", body: body, headers: { "Content-Type": "application/json" }
    }).then(function (r) {
      if (r.status === 403) { showError("Spotify Premium is required for in-page playback."); premiumOk = false; refreshUI(); return; }
      if (!r.ok && r.status !== 204) showError("Playback failed (" + r.status + ").");
      else {
        playlists.open = false;
        if (!npBar.classList.contains("hidden")) setCompact(true);
      }
    }).catch(function (e) { showError(e.message); });
  }

  function transport(action) {
    if (!spotifyObj) return;
    if (action === "toggle") spotifyObj.togglePlay().catch(function () {});
    else api("/me/player/" + action, { method: "POST" }).catch(function () {});
  }

  function renderNowPlaying(state) {
    if (!state || !state.track_window || !state.track_window.current_track) {
      isPlaying = false;
      npBar.classList.add("hidden");
      setCompact(false);
      return;
    }
    var showPlayerOnly = npBar.classList.contains("hidden") || (!state.paused && !isPlaying);
    if (!state.paused && !isPlaying) playlists.open = false;
    isPlaying = !state.paused;
    var tr = state.track_window.current_track;
    npTitle.textContent = tr.name || "";
    npArtist.textContent = (tr.artists || []).map(function (a) { return a.name; }).join(", ");
    var img = (tr.album && tr.album.images && tr.album.images[0]) ? tr.album.images[0].url : "";
    if (img) { coverEl.src = img; coverEl.style.display = ""; } else { coverEl.style.display = "none"; }
    playBtn.textContent = state.paused ? "▶" : "⏸";
    npBar.classList.remove("hidden");
    setCompact(showPlayerOnly || player.classList.contains("compact"));
  }

  // Parse a pasted link into a spotify:<type>:<id> URI.
  function linkToUri(input) {
    var m = String(input || "").trim().match(
      /open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(?:embed\/)?(track|album|playlist|episode|show)\/([A-Za-z0-9]+)/i
    );
    if (!m) return null;
    return { uri: "spotify:" + m[1].toLowerCase() + ":" + m[2], kind: m[1].toLowerCase() };
  }

  // ===== UI state =====
  function isLoggedIn() { return !!loadToken(); }

  function setCompact(compact) {
    var hasTrack = !npBar.classList.contains("hidden");
    compact = hasTrack && compact;
    player.classList.toggle("compact", compact);
    expandBtn.classList.toggle("hidden", !hasTrack);
    expandBtn.textContent = compact ? "\u2191" : "\u2193";
    expandBtn.title = compact ? "Expand music settings" : "Show player only";
    expandBtn.setAttribute("aria-label", expandBtn.title);
    expandBtn.setAttribute("aria-expanded", String(!compact));
  }

  function refreshUI() {
    if (isLoggedIn() && premiumOk) {
      authView.classList.add("hidden");
    } else {
      authView.classList.remove("hidden");
      setCompact(false);
      authHint.textContent = isLoggedIn()
        ? "Spotify Premium is required for full playback."
        : "Sign in to play full tracks.";
    }
    logoutBtn.classList.toggle("hidden", !isLoggedIn());
  }

  function openPanel() {
    player.classList.remove("hidden");
    player.classList.remove("collapsed");
    pill.classList.add("hidden");
    pill.setAttribute("aria-expanded", "true");
    setCompact(!npBar.classList.contains("hidden"));
    refreshUI();
    if (urlInput && !urlInput.value) { var saved = read(K.url, ""); if (saved) urlInput.value = saved; }
  }
  function closePanel() {
    player.classList.add("hidden");
    player.classList.remove("collapsed");
    pill.classList.remove("hidden");
    pill.setAttribute("aria-expanded", "false");
  }
  function minimise() { closePanel(); }

  // ===== Wire controls =====
  pill.addEventListener("click", openPanel);
  logoutBtn.addEventListener("click", function () {
    if (spotifyObj) { try { spotifyObj.disconnect(); } catch (e) {} }
    isPlaying = false;
    playlists.open = true;
    npBar.classList.add("hidden");
    setCompact(false);
    clearAuth(); refreshUI(); closePanel();
  });
  collapseBtn.addEventListener("click", minimise);
  expandBtn.addEventListener("click", function () { setCompact(!player.classList.contains("compact")); });
  loginBtn.addEventListener("click", login);
  playBtn.addEventListener("click", function () { transport("toggle"); });
  prevBtn.addEventListener("click", function () { transport("previous"); });
  nextBtn.addEventListener("click", function () { transport("next"); });
  volEl.addEventListener("input", function () { if (spotifyObj) spotifyObj.setVolume(parseFloat(volEl.value)); });

  loadBtn.addEventListener("click", function () {
    var parsed = linkToUri(urlInput.value);
    if (!parsed) { showError("That doesn't look like a Spotify link."); return; }
    write(K.url, urlInput.value.trim());
    playContext(parsed.uri, parsed.kind);
  });
  urlInput.addEventListener("keydown", function (e) { if (e.key === "Enter") loadBtn.click(); });
  document.getElementById("sp-saved").addEventListener("change", function () {
    var link = document.getElementById("sp-saved-link");
    link.classList.toggle("hidden", !this.value);
    if (!this.value) { link.removeAttribute("href"); return; }
    link.href = this.value;
    urlInput.value = this.value;
    openPanel();
    loadBtn.click();
  });

  // ===== Init =====
  function afterLogin() {
    // Confirm Premium via /me, then bring up the SDK + library.
    api("/me").then(function (r) { return r.json(); }).then(function (me) {
      if (me.product !== "premium") {
        showError("In-page playback needs Spotify Premium.");
        premiumOk = false;
      } else {
        premiumOk = true;
        maybeCreatePlayer();
      }
      refreshUI();
    }).catch(function () { premiumOk = true; maybeCreatePlayer(); refreshUI(); });
  }

  (function init() {
    var params = new URLSearchParams(window.location.search);
    var code = params.get("code"), state = params.get("state");
    var savedState = sesGet(K.state);
    if (code && state && savedState && state === savedState) {
      sesDel(K.state);
      exchangeCode(code).then(function (res) {
        if (!res.ok || !res.j.access_token) { showError("Login failed: " + (res.j.error_description || res.j.error || "unknown")); window.history.replaceState({}, "", redirectUri()); return; }
        saveToken({
          access_token: res.j.access_token,
          refresh_token: res.j.refresh_token,
          expires_at: Date.now() + res.j.expires_in * 1000
        });
        window.history.replaceState({}, "", redirectUri());
        afterLogin();
      }).catch(function () { showError("Login exchange failed."); });
    } else if (loadToken()) {
      afterLogin();
    } else {
      refreshUI();
    }
  })();
})();
