import { lookup } from "node:dns";
import https from "node:https";
import { Readable } from "node:stream";

export function isPublicIpv4(address) {
  const bytes = address.split(".").map(Number);
  if (bytes.length !== 4 || bytes.some(byte => !Number.isInteger(byte) || byte < 0 || byte > 255)) return false;
  const [a, b] = bytes;
  return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && (b === 168 || b === 0 || b === 2)) ||
    (a === 198 && (b === 18 || b === 19 || b === 51)) ||
    (a === 203 && b === 0));
}

export function validatePublicUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password ||
      (url.port && url.port !== "443") || url.hostname === "localhost" ||
      url.hostname.includes(":") || /^\d+(\.\d+){3}$/.test(url.hostname)) {
    throw new Error("Upstream must be a public HTTPS hostname on port 443.");
  }
  return url;
}

function publicLookup(hostname, options, callback) {
  lookup(hostname, { family: 4, all: true }, (error, addresses) => {
    if (error) return callback(error);
    if (!addresses.length || addresses.some(item => !isPublicIpv4(item.address))) {
      return callback(new Error("Upstream DNS resolved to a non-public address."));
    }
    if (options.all) return callback(null, addresses);
    callback(null, addresses[0].address, 4);
  });
}

// Use native HTTPS over IPv4: fetch's connection selection timed out on this host.
export async function publicFetch(value, options = {}, redirects = 0) {
  const url = validatePublicUrl(value);
  const signal = options.signal || AbortSignal.timeout(30000);
  const response = await new Promise((resolve, reject) => {
    const request = https.get(url, {
      headers: options.headers,
      lookup: publicLookup,
      family: 4,
      signal
    }, resolve);
    request.on("error", reject);
  });
  if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
    response.destroy();
    if (redirects >= 3 || !response.headers.location) throw new Error("Invalid upstream redirect chain.");
    const target = validatePublicUrl(new URL(response.headers.location, url));
    const headers = new Headers(options.headers);
    if (target.origin !== url.origin) {
      for (const name of ["authorization", "cookie", "host"]) headers.delete(name);
    }
    return publicFetch(target, { ...options, signal, headers: Object.fromEntries(headers) }, redirects + 1);
  }
  const headers = new Headers();
  for (const [name, value] of Object.entries(response.headers)) {
    if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(", ") : value);
  }
  const body = [204, 205, 304].includes(response.statusCode) ? null : Readable.toWeb(response);
  if (!body) response.resume();
  const result = new Response(body, { status: response.statusCode, headers });
  Object.defineProperty(result, "url", { value: url.href });
  return result;
}
