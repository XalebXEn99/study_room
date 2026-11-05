import { createAuthClient } from "./assets/vendor/neon-auth.js";
import { createWorkspaceSync, readRecovery } from "./cloud-sync.js";

const $ = id => document.getElementById(id);
const config = window.studyRoomCloudConfig;
const documents = window.studyRoomDocuments;
let auth;
let user = null;
let sync = null;
let signingUp = false;
let busy = false;
let guestDrafts = [];
let versionsFile = null;
let versionsNext = null;
let sessionsNext = null;
let sessionFlush = null;
let pendingSessions = [];
let sessionReadFailed = false;

function status(text, error = false) {
  $("cloud-status").textContent = text;
  $("cloud-status").classList.toggle("error", error);
  $("cloud-retry").hidden = !user || !error;
}

function resultData(result) {
  if (result.error) throw new Error(result.error.message || "Authentication failed. Please retry.");
  return result.data;
}

async function api(path, { method = "GET", body } = {}) {
  if (!user) throw new Error("Sign in to access your study space.");
  const accountId = user.id;
  const data = resultData(await auth.token());
  // Managed SDK 0.8.2 can satisfy token() from its JWT-bearing session cache.
  const token = data?.token ?? data?.session?.token;
  if (typeof token !== "string" || token.split(".").length !== 3) throw new Error("Your session expired. Sign in again.");
  const response = await fetch(new URL(path, config.apiUrl), {
    method,
    headers: {
      Authorization: "Bearer " + token,
      ...(body === undefined ? {} : { "Content-Type": "application/json" })
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
    cache: "no-store"
  });
  if (user?.id !== accountId) throw new Error("Your account changed. The previous request was not applied to this workspace.");
  const value = await response.json();
  if (!response.ok) throw new Error(value.error || "Cloud request failed (HTTP " + response.status + ").");
  return value;
}

function updateAccount() {
  $("account-form").hidden = Boolean(user);
  $("account-user").hidden = !user;
  $("account-user").textContent = user ? user.email : "";
  $("account-signout").hidden = !user;
  $("cloud-history").hidden = !user;
  $("cloud-import-tab").hidden = !user || !guestDrafts.length;
  $("cloud-import").hidden = !user || !localStorage.getItem("md-files") ||
    localStorage.getItem("study-room-legacy-imported:" + user.id) === "true";
}

async function run(action) {
  if (busy) return;
  busy = true;
  document.querySelectorAll(".account-panel button, .account-panel input").forEach(node => { node.disabled = true; });
  try {
    await action();
  } catch (error) {
    console.error("Study account:", error.message);
    status(error.message, true);
  } finally {
    busy = false;
    document.querySelectorAll(".account-panel button, .account-panel input").forEach(node => { node.disabled = false; });
  }
}

function sessionKey() {
  return "study-room-pending-sessions:" + user.id;
}

async function flushSessions() {
  if (!user || sessionReadFailed) return;
  if (sessionFlush) return sessionFlush;
  const key = sessionKey();
  const work = (async () => {
    while (pendingSessions.length) {
      const session = pendingSessions[0];
      await api("sessions", { method: "POST", body: session });
      pendingSessions.shift();
      if (pendingSessions.length) localStorage.setItem(key, JSON.stringify(pendingSessions));
      else localStorage.removeItem(key);
    }
  })();
  sessionFlush = work;
  try {
    return await work;
  } finally {
    if (sessionFlush === work) sessionFlush = null;
  }
}

async function showSessions(append = false) {
  const page = await api("sessions" + (append && sessionsNext ? "?before=" + encodeURIComponent(sessionsNext) : ""));
  if (!append) $("cloud-sessions").replaceChildren();
  for (const session of page.items) {
    const row = document.createElement("li");
    row.textContent = new Date(session.finishedAt).toLocaleString() + " - " +
      Math.round(session.durationMs / 1000) + " seconds - " + session.technique;
    $("cloud-sessions").append(row);
  }
  if (!page.items.length && !append) {
    const row = document.createElement("li");
    row.textContent = "Completed timers will appear here.";
    $("cloud-sessions").append(row);
  }
  sessionsNext = page.next;
  $("cloud-sessions-more").hidden = !sessionsNext;
}

async function showVersions(append = false) {
  const file = documents.active();
  if (!file?.cloudId || !file.version) throw new Error("Save a document before viewing its versions.");
  await sync.flush();
  const id = file.cloudId;
  const page = await api("documents/" + id + "/revisions" +
    (append && versionsNext && versionsFile === id ? "?before=" + versionsNext : ""));
  if (!append || versionsFile !== id) $("cloud-versions").replaceChildren();
  versionsFile = id;
  for (const revision of page.items) {
    const row = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = "v" + revision.version + " - " + revision.name + " - " + new Date(revision.createdAt).toLocaleString() + " ";
    const restore = document.createElement("button");
    restore.type = "button";
    restore.textContent = "Restore";
    restore.addEventListener("click", () => run(async () => {
      await sync.flush();
      const saved = await api("documents/" + id + "/revisions/" + revision.version);
      documents.restoreRevision(id, saved.name, saved.raw);
      await sync.flush();
      await showVersions();
    }));
    row.append(text, restore);
    $("cloud-versions").append(row);
  }
  versionsNext = page.next;
  $("cloud-versions-more").hidden = !versionsNext;
}

async function loadAccount() {
  const session = resultData(await auth.getSession());
  if (!session?.user) {
    if (user) {
      sync?.stop();
      sync = null;
      user = null;
      pendingSessions = [];
      documents.replaceWorkspace([]);
      $("cloud-sessions").replaceChildren();
      $("cloud-versions").replaceChildren();
      window.dispatchEvent(new Event("study-room-account-change"));
    }
    status("Sign in for private files and history. Signed-out edits stay in this tab.");
    updateAccount();
    return;
  }
  if (user?.id === session.user.id && sync?.ready) return;
  if (!user) guestDrafts = documents.snapshot();
  sync?.stop();
  user = session.user;
  sync = createWorkspaceSync({ api, documents, storage: localStorage, ownerId: user.id, onStatus: status });
  updateAccount();
  status("Loading your private files...");
  await sync.load();
  try {
    pendingSessions = readRecovery(localStorage, sessionKey());
    if (!pendingSessions.every(item => item && typeof item.id === "string" && Number.isInteger(item.durationMs) &&
        typeof item.startedAt === "string" && typeof item.finishedAt === "string" && typeof item.technique === "string")) {
      throw new Error("Saved study history is unreadable and has not been overwritten.");
    }
    sessionReadFailed = false;
  } catch (error) {
    sessionReadFailed = true;
    throw error;
  }
  window.dispatchEvent(new Event("study-room-account-change"));
  await flushSessions();
  await showSessions();
  if (guestDrafts.length) status("Private files loaded. You can import the drafts you wrote before signing in.");
}

window.studyRoomHistory = {
  get ownerId() { return user?.id || null; },
  record(session, ownerId) {
    if (!user || user.id !== ownerId || sessionReadFailed) {
      throw new Error("Sign in to the account that started this timer to save its history.");
    }
    if (!pendingSessions.some(item => item.id === session.id)) pendingSessions.push(session);
    localStorage.setItem(sessionKey(), JSON.stringify(pendingSessions));
    void flushSessions().then(() => showSessions()).catch(error => {
      console.error("Study history:", error.message);
      status("Study history is pending on this device: " + error.message, true);
    });
  }
};

window.addEventListener("study-room-documents-change", () => {
  sync?.observe();
  if (!user && documents.snapshot().length) status("This tab has unsaved drafts. Sign in to import them, or download a copy.");
  if (versionsFile && documents.active()?.cloudId !== versionsFile) {
    versionsFile = null;
    versionsNext = null;
    $("cloud-versions").replaceChildren();
    $("cloud-versions-more").hidden = true;
  }
});
window.addEventListener("beforeunload", event => {
  if (sync?.dirty || guestDrafts.length || (!user && documents.snapshot().length)) {
    event.preventDefault();
    event.returnValue = "";
  }
});
window.addEventListener("online", () => {
  if (!user) return;
  void run(async () => {
    if (!sync?.ready) await loadAccount();
    else await sync.flush();
    await flushSessions();
  });
  window.addEventListener("focus", () => {
    if (!auth || busy) return;
    void run(loadAccount);
  });
});

$("account-mode").addEventListener("click", () => {
  signingUp = !signingUp;
  $("account-name-label").hidden = !signingUp;
  $("account-name").hidden = !signingUp;
  $("account-name").required = signingUp;
  $("account-password").autocomplete = signingUp ? "new-password" : "current-password";
  $("account-submit").textContent = signingUp ? "Create account" : "Sign in";
  $("account-mode").textContent = signingUp ? "Use an existing account" : "Create an account";
});
$("account-form").addEventListener("submit", event => {
  event.preventDefault();
  void run(async () => {
    status(signingUp ? "Creating your account..." : "Signing in...");
    const credentials = { email: $("account-email").value.trim(), password: $("account-password").value };
    resultData(await (signingUp
      ? auth.signUp.email({ ...credentials, name: $("account-name").value.trim() })
      : auth.signIn.email(credentials)));
    $("account-password").value = "";
    await loadAccount();
    if (!user && signingUp) status("Account created. Click Email a sign-in code to verify your email and sign in.");
  });
});
$("account-send-code").addEventListener("click", () => run(async () => {
  if (!$("account-email").reportValidity()) return;
  resultData(await auth.emailOtp.sendVerificationOtp({ email: $("account-email").value.trim(), type: "sign-in" }));
  $("account-code-fields").hidden = false;
  status("A sign-in code was requested. Check your email, then enter the code.");
  $("account-code").focus();
}));
$("account-verify-code").addEventListener("click", () => run(async () => {
  const otp = $("account-code").value.trim();
  if (!otp) throw new Error("Enter the code from your email.");
  resultData(await auth.signIn.emailOtp({ email: $("account-email").value.trim(), otp }));
  $("account-code").value = "";
  $("account-code-fields").hidden = true;
  await loadAccount();
}));
$("account-signout").addEventListener("click", () => run(async () => {
  if (sync?.ready) await sync.flush();
  await flushSessions();
  resultData(await auth.signOut());
  sync?.stop();
  sync = null;
  user = null;
  pendingSessions = [];
  documents.replaceWorkspace([]);
  $("cloud-sessions").replaceChildren();
  $("cloud-versions").replaceChildren();
  $("account-password").value = "";
  $("account-code").value = "";
  $("account-email").value = "";
  updateAccount();
  window.dispatchEvent(new Event("study-room-account-change"));
  status("Signed out. Your cloud files are private.");
}));
$("cloud-retry").addEventListener("click", () => run(async () => {
  if (!sync?.ready) await loadAccount();
  else await sync.flush();
  await flushSessions();
  await showSessions();
}));
$("cloud-import").addEventListener("click", () => run(async () => {
  if (!window.confirm("Import this browser's old drafts into " + user.email + "? Other accounts will not see them.")) return;
  await sync.import(readRecovery(localStorage, "md-files"));
  localStorage.setItem("study-room-legacy-imported:" + user.id, "true");
  updateAccount();
}));
$("cloud-import-tab").addEventListener("click", () => run(async () => {
  await sync.import(guestDrafts);
  guestDrafts = [];
  updateAccount();
}));
$("cloud-versions-refresh").addEventListener("click", () => run(() => showVersions()));
$("cloud-versions-more").addEventListener("click", () => run(() => showVersions(true)));
$("cloud-sessions-more").addEventListener("click", () => run(() => showSessions(true)));

if (window.studyRoomCloudConfigured) {
  auth = createAuthClient(config.authUrl);
  void run(loadAccount);
} else {
  $("account-form").hidden = true;
  status("Cloud setup is incomplete. This copy uses local browser drafts; do not treat them as private cloud storage.", true);
}
