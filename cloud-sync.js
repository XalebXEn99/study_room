const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const fingerprint = file => JSON.stringify([file.name, file.raw, file.origin, file.theme, file.closed]);
const remoteEntry = file => ({ ...file, id: file.cloudId });

export function readRecovery(storage, key) {
  const raw = storage.getItem(key);
  if (!raw) return [];
  const entries = JSON.parse(raw);
  if (!Array.isArray(entries)) throw new Error("Saved recovery data is unreadable and has not been overwritten.");
  return entries;
}

export function createWorkspaceSync({ api, documents, storage, ownerId, onStatus, delay = 800 }) {
  const key = "study-room-cloud-drafts:" + ownerId;
  const activeKey = "study-room-cloud-active:" + ownerId;
  const saved = new Map();
  let ready = false;
  let timer;
  let inFlight;
  let stopped = false;
  const changed = () => documents.snapshot().filter(file => saved.get(file.cloudId) !== fingerprint(file));
  function cache() {
    const pending = changed().map(remoteEntry);
    if (pending.length) storage.setItem(key, JSON.stringify(pending));
    else storage.removeItem(key);
  }
  function rememberActive() {
    const activeId = documents.active?.()?.cloudId;
    if (activeId) storage.setItem(activeKey, activeId);
  }
  async function flush() {
    clearTimeout(timer);
    if (inFlight) return inFlight;
    if (!ready || stopped) throw new Error("Your private workspace has not finished loading.");
    const work = (async () => {
      try {
        while (changed().length && !stopped) {
          onStatus("Saving private files...");
          for (const file of changed()) {
            if (stopped) break;
            const result = await api("documents/" + file.cloudId, { method: "PUT", body: file });
            documents.acknowledge(file.cloudId, result.version);
            saved.set(file.cloudId, fingerprint(file));
            cache();
          }
        }
        if (!stopped) onStatus("All files saved privately.");
      } catch (error) {
        onStatus(error.message + " Pending edits are kept on this device; you can also download a copy.", true);
        throw error;
      }
    })();
    inFlight = work;
    try {
      return await work;
    } finally {
      if (inFlight === work) inFlight = null;
    }
  }
  return {
    get dirty() { return ready && changed().length > 0; },
    get ready() { return ready; },
    async load() {
      const recovery = readRecovery(storage, key);
      if (!recovery.every(file => file && UUID.test(file.id) && typeof file.raw === "string" &&
          typeof file.name === "string" && Number.isSafeInteger(file.version) && file.version >= 0 &&
          ["created", "upload"].includes(file.origin) && typeof file.theme === "string" && typeof file.closed === "boolean")) {
        throw new Error("Saved draft recovery data is unreadable and has not been overwritten.");
      }
      const entries = [];
      let after = null;
      do {
        const page = await api("documents" + (after ? "?after=" + encodeURIComponent(after) : ""));
        for (let i = 0; i < page.items.length; i += 4) {
          const batch = await Promise.all(page.items.slice(i, i + 4).map(file => api("documents/" + file.id)));
          entries.push(...batch);
        }
        after = page.next;
      } while (after);
      if (stopped) return;
      for (const entry of entries) saved.set(entry.id, fingerprint(entry));
      for (const draft of recovery) {
        const index = entries.findIndex(entry => entry.id === draft.id);
        if (index === -1) entries.push(draft);
        else if (fingerprint(entries[index]) !== fingerprint(draft)) entries[index] = draft;
      }
      documents.replaceWorkspace(entries, storage.getItem(activeKey));
      ready = true;
      if (recovery.length) {
        onStatus("Recovered pending edits from this device. Saving...");
        await flush();
      } else {
        onStatus("Your private files are up to date.");
      }
    },
    observe() {
      if (!ready || stopped) return;
      try {
        rememberActive();
        if (!changed().length) return;
        cache();
        onStatus("Changes pending...");
      } catch (error) {
        onStatus("Device recovery storage failed. Keep this tab open or download your edits while cloud saving retries.", true);
        console.error("Could not cache private draft recovery:", error.message);
      }
      clearTimeout(timer);
      timer = setTimeout(() => { void flush().catch(error => console.error("Cloud autosave:", error.message)); }, delay);
    },
    async import(entries) {
      if (!ready) throw new Error("Wait for your private files to load before importing.");
      const current = documents.snapshot().map(remoteEntry);
      for (const file of entries) {
        if (!file || typeof file.name !== "string" || typeof file.raw !== "string") {
          throw new Error("An imported draft is unreadable. The original browser data has not been changed.");
        }
        if (file.origin === "starter" && !file.raw) continue;
        if (current.some(item => item.name === file.name && item.raw === file.raw)) continue;
        current.push({
          id: crypto.randomUUID(), version: 0, name: file.name, raw: file.raw,
          origin: file.origin === "created" ? "created" : "upload",
          theme: typeof file.theme === "string" ? file.theme : "default", closed: false
        });
      }
      documents.replaceWorkspace(current);
      cache();
      await flush();
    },
    flush,
    stop() {
      stopped = true;
      clearTimeout(timer);
    }
  };
}
