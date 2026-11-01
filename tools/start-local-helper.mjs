#!/usr/bin/env node
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { pathToFileURL } from "node:url";
import { createInterface } from "node:readline/promises";
import { createBridge } from "./streamplay-server.mjs";

export const LIVE_PAGE = "https://xalebxen99.github.io/study_room/";

export function pairingUrl(port, token) {
  const url = new URL(LIVE_PAGE);
  url.hash = new URLSearchParams({
    "study-room-helper": "http://127.0.0.1:" + port,
    token
  }).toString();
  return url.href;
}

export async function startHelper({ tmdbToken = "", port = 0 } = {}) {
  const token = randomBytes(32).toString("hex");
  const server = createBridge({
    tmdbToken, bridgeToken: token, publicUrl: "",
    frontendOrigin: new URL(LIVE_PAGE).origin
  });
  server.listen(port, "127.0.0.1");
  await once(server, "listening");
  return { server, url: pairingUrl(server.address().port, token), token };
}

function openBrowser(url) {
  let command;
  let args;
  if (process.platform === "win32") {
    command = "powershell.exe";
    args = ["-NoProfile", "-NonInteractive", "-Command", "Start-Process '" + url + "'"];
  } else {
    command = process.platform === "darwin" ? "open" : "xdg-open";
    args = [url];
  }
  const child = spawn(command, args, { stdio: "ignore" });
  child.on("error", error => console.error("Could not open browser:", error.message, "Use the link printed above."));
  child.on("exit", code => {
    if (code) console.error("Browser opener exited with code", code, "- use the link printed above.");
  });
}

async function main() {
  if (Number(process.versions.node.split(".")[0]) < 22) throw new Error("Node.js 22 or newer is required.");
  let tmdbToken = process.env.TMDB_READ_TOKEN || "";
  if (!tmdbToken && process.stdin.isTTY) {
    const input = createInterface({ input: process.stdin, output: process.stdout });
    try {
      console.log("Full search needs your TMDB API Read Access Token. It stays in memory; do not use personal tokens on an untrusted computer.");
      tmdbToken = (await input.question("TMDB token (Enter to skip and try Sintel): ")).trim();
    } finally { input.close(); }
  }
  const { server, url } = await startHelper({ tmdbToken });
  console.log("Local helper ready. Keep this terminal open; press Ctrl+C to stop.");
  console.log("Open this private pairing link (do not share it):\n" + url);
  console.log("Allow local-network access if your browser asks. No public ports or hosting are required.");
  server.on("error", error => console.error("Helper server error:", error.message));
  if (!process.argv.includes("--no-open")) openBrowser(url);
  process.once("SIGINT", () => {
    server.closeAllConnections();
    server.close();
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error("Local helper failed:", error.message); process.exitCode = 1; });
}
