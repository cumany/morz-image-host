"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@tauri-apps/api/external/tslib/tslib.es6.js
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
var init_tslib_es6 = __esm({
  "node_modules/@tauri-apps/api/external/tslib/tslib.es6.js"() {
  }
});

// node_modules/@tauri-apps/api/core.js
var core_exports = {};
__export(core_exports, {
  Channel: () => Channel,
  PluginListener: () => PluginListener,
  Resource: () => Resource,
  SERIALIZE_TO_IPC_FN: () => SERIALIZE_TO_IPC_FN,
  addPluginListener: () => addPluginListener,
  checkPermissions: () => checkPermissions,
  convertFileSrc: () => convertFileSrc,
  invoke: () => invoke,
  isTauri: () => isTauri,
  requestPermissions: () => requestPermissions,
  transformCallback: () => transformCallback
});
function transformCallback(callback, once = false) {
  return window.__TAURI_INTERNALS__.transformCallback(callback, once);
}
async function addPluginListener(plugin, event, cb) {
  const handler = new Channel(cb);
  try {
    await invoke(`plugin:${plugin}|register_listener`, {
      event,
      handler
    });
    return new PluginListener(plugin, event, handler.id);
  } catch {
    await invoke(`plugin:${plugin}|registerListener`, { event, handler });
    return new PluginListener(plugin, event, handler.id);
  }
}
async function checkPermissions(plugin) {
  return invoke(`plugin:${plugin}|check_permissions`);
}
async function requestPermissions(plugin) {
  return invoke(`plugin:${plugin}|request_permissions`);
}
async function invoke(cmd, args = {}, options) {
  return window.__TAURI_INTERNALS__.invoke(cmd, args, options);
}
function convertFileSrc(filePath, protocol = "asset") {
  return window.__TAURI_INTERNALS__.convertFileSrc(filePath, protocol);
}
function isTauri() {
  return !!(globalThis || window).isTauri;
}
var _Channel_instances, _Channel_onmessage, _Channel_nextMessageIndex, _Channel_pendingMessages, _Channel_messageEndIndex, _Channel_deliver, _Resource_rid, SERIALIZE_TO_IPC_FN, Channel, PluginListener, Resource;
var init_core = __esm({
  "node_modules/@tauri-apps/api/core.js"() {
    init_tslib_es6();
    SERIALIZE_TO_IPC_FN = "__TAURI_TO_IPC_KEY__";
    Channel = class {
      constructor(onmessage) {
        _Channel_instances.add(this);
        _Channel_onmessage.set(this, void 0);
        _Channel_nextMessageIndex.set(this, 0);
        _Channel_pendingMessages.set(this, []);
        _Channel_messageEndIndex.set(this, void 0);
        __classPrivateFieldSet(this, _Channel_onmessage, onmessage || (() => {
        }), "f");
        this.id = transformCallback((rawMessage) => {
          const index = rawMessage.index;
          if ("end" in rawMessage) {
            if (index == __classPrivateFieldGet(this, _Channel_nextMessageIndex, "f")) {
              this.cleanupCallback();
            } else {
              __classPrivateFieldSet(this, _Channel_messageEndIndex, index, "f");
            }
            return;
          }
          const message = rawMessage.message;
          if (index == __classPrivateFieldGet(this, _Channel_nextMessageIndex, "f")) {
            __classPrivateFieldGet(this, _Channel_instances, "m", _Channel_deliver).call(this, message);
            __classPrivateFieldSet(this, _Channel_nextMessageIndex, __classPrivateFieldGet(this, _Channel_nextMessageIndex, "f") + 1, "f");
            while (__classPrivateFieldGet(this, _Channel_nextMessageIndex, "f") in __classPrivateFieldGet(this, _Channel_pendingMessages, "f")) {
              const message2 = __classPrivateFieldGet(this, _Channel_pendingMessages, "f")[__classPrivateFieldGet(this, _Channel_nextMessageIndex, "f")];
              __classPrivateFieldGet(this, _Channel_instances, "m", _Channel_deliver).call(this, message2);
              delete __classPrivateFieldGet(this, _Channel_pendingMessages, "f")[__classPrivateFieldGet(this, _Channel_nextMessageIndex, "f")];
              __classPrivateFieldSet(this, _Channel_nextMessageIndex, __classPrivateFieldGet(this, _Channel_nextMessageIndex, "f") + 1, "f");
            }
            if (__classPrivateFieldGet(this, _Channel_nextMessageIndex, "f") === __classPrivateFieldGet(this, _Channel_messageEndIndex, "f")) {
              this.cleanupCallback();
            }
          } else {
            __classPrivateFieldGet(this, _Channel_pendingMessages, "f")[index] = message;
          }
        });
      }
      cleanupCallback() {
        window.__TAURI_INTERNALS__.unregisterCallback(this.id);
      }
      /**
       * The handler called for every message sent by the Rust side of this channel.
       *
       * Assigning a new handler replaces the previous one; messages that arrived
       * before a handler was set are not replayed, so set it (or pass it to the
       * constructor) before sending the channel to the backend.
       */
      set onmessage(handler) {
        __classPrivateFieldSet(this, _Channel_onmessage, handler, "f");
      }
      get onmessage() {
        return __classPrivateFieldGet(this, _Channel_onmessage, "f");
      }
      [(_Channel_onmessage = /* @__PURE__ */ new WeakMap(), _Channel_nextMessageIndex = /* @__PURE__ */ new WeakMap(), _Channel_pendingMessages = /* @__PURE__ */ new WeakMap(), _Channel_messageEndIndex = /* @__PURE__ */ new WeakMap(), _Channel_instances = /* @__PURE__ */ new WeakSet(), _Channel_deliver = function _Channel_deliver2(message) {
        try {
          __classPrivateFieldGet(this, _Channel_onmessage, "f").call(this, message);
        } catch (error) {
          queueMicrotask(() => {
            throw error;
          });
        }
      }, SERIALIZE_TO_IPC_FN)]() {
        return `__CHANNEL__:${this.id}`;
      }
      toJSON() {
        return this[SERIALIZE_TO_IPC_FN]();
      }
    };
    PluginListener = class {
      constructor(plugin, event, channelId) {
        this.plugin = plugin;
        this.event = event;
        this.channelId = channelId;
      }
      /** Removes this listener from the plugin, so its handler stops being called. */
      async unregister() {
        return invoke(`plugin:${this.plugin}|remove_listener`, {
          event: this.event,
          channelId: this.channelId
        });
      }
    };
    Resource = class {
      get rid() {
        return __classPrivateFieldGet(this, _Resource_rid, "f");
      }
      constructor(rid) {
        _Resource_rid.set(this, void 0);
        __classPrivateFieldSet(this, _Resource_rid, rid, "f");
      }
      /**
       * Destroys and cleans up this resource from memory.
       * **You should not call any method on this object anymore and should drop any reference to it.**
       *
       * @remarks Uses the `core:resources:allow-close` permission, which is part of
       * the `core:resources:default` permission set enabled by default.
       */
      async close() {
        return invoke("plugin:resources|close", {
          rid: this.rid
        });
      }
      async [(_Resource_rid = /* @__PURE__ */ new WeakMap(), Symbol.asyncDispose)]() {
        await this.close();
      }
    };
  }
});

// node_modules/@tauri-apps/plugin-http/dist-js/index.js
var dist_js_exports = {};
__export(dist_js_exports, {
  fetch: () => fetch2
});
async function fetch2(input, init) {
  const signal = init?.signal;
  if (signal?.aborted) {
    throw new Error(ERROR_REQUEST_CANCELLED);
  }
  const maxRedirections = init?.maxRedirections;
  const connectTimeout = init?.connectTimeout;
  const proxy = init?.proxy;
  const danger = init?.danger;
  if (init) {
    delete init.maxRedirections;
    delete init.connectTimeout;
    delete init.proxy;
    delete init.danger;
  }
  const headers = init?.headers ? init.headers instanceof Headers ? init.headers : new Headers(init.headers) : new Headers();
  const req = new Request(input, init);
  const buffer = await req.arrayBuffer();
  const data = buffer.byteLength !== 0 ? Array.from(new Uint8Array(buffer)) : null;
  for (const [key, value] of req.headers) {
    if (!headers.get(key)) {
      headers.set(key, value);
    }
  }
  const headersArray = headers instanceof Headers ? Array.from(headers.entries()) : Array.isArray(headers) ? headers : Object.entries(headers);
  const mappedHeaders = headersArray.map(([name, val]) => [
    name,
    // we need to ensure we have all header values as strings
    // eslint-disable-next-line
    typeof val === "string" ? val : val.toString()
  ]);
  if (signal?.aborted) {
    throw new Error(ERROR_REQUEST_CANCELLED);
  }
  const rid = await invoke("plugin:http|fetch", {
    clientConfig: {
      method: req.method,
      url: req.url,
      headers: mappedHeaders,
      data,
      maxRedirections,
      connectTimeout,
      proxy,
      danger
    }
  });
  const abort = () => invoke("plugin:http|fetch_cancel", { rid }).catch(() => {
  });
  if (signal?.aborted) {
    void abort();
    throw new Error(ERROR_REQUEST_CANCELLED);
  }
  signal?.addEventListener("abort", () => void abort());
  const { status, statusText, url, headers: responseHeaders, rid: responseRid } = await invoke("plugin:http|fetch_send", {
    rid
  });
  let bodyDropped = false;
  const dropBody = () => {
    if (bodyDropped)
      return Promise.resolve();
    bodyDropped = true;
    return invoke("plugin:http|fetch_cancel_body", { rid: responseRid }).catch(() => {
    });
  };
  const readChunk = async (controller) => {
    let data2;
    try {
      data2 = await invoke("plugin:http|fetch_read_body", {
        rid: responseRid
      });
    } catch (e) {
      controller.error(e);
      void dropBody();
      return;
    }
    const dataUint8 = new Uint8Array(data2);
    const lastByte = dataUint8[dataUint8.byteLength - 1];
    const actualData = dataUint8.slice(0, dataUint8.byteLength - 1);
    if (lastByte === 1) {
      controller.close();
      return;
    }
    controller.enqueue(actualData);
  };
  const body = [101, 103, 204, 205, 304].includes(status) ? null : new ReadableStream({
    start: (controller) => {
      signal?.addEventListener("abort", () => {
        controller.error(ERROR_REQUEST_CANCELLED);
        void dropBody();
      });
    },
    pull: (controller) => readChunk(controller),
    cancel: () => {
      void dropBody();
    }
  });
  const res = new Response(body, {
    status,
    statusText
  });
  Object.defineProperty(res, "url", { value: url, writable: false });
  Object.defineProperty(res, "headers", {
    value: new Headers(responseHeaders),
    writable: false
  });
  const originalClone = res.clone.bind(res);
  Object.defineProperty(res, "clone", {
    value: () => {
      const cloned = originalClone();
      Object.defineProperty(cloned, "url", { value: url, writable: false });
      Object.defineProperty(cloned, "headers", {
        value: new Headers(responseHeaders),
        writable: false
      });
      return cloned;
    }
  });
  return res;
}
var ERROR_REQUEST_CANCELLED;
var init_dist_js = __esm({
  "node_modules/@tauri-apps/plugin-http/dist-js/index.js"() {
    init_core();
    ERROR_REQUEST_CANCELLED = "Request cancelled";
  }
});

// scripts/image-host-entry.ts
var image_host_entry_exports = {};
__export(image_host_entry_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(image_host_entry_exports);

// src/app/i18n.ts
var prefKey = "morz.language";
function initial() {
  try {
    const stored = localStorage.getItem(prefKey);
    if (stored === "zh" || stored === "en") return stored;
  } catch {
  }
  const langs = (navigator.languages?.length ? navigator.languages : [navigator.language]) || ["en"];
  return langs.some((l) => /^zh/i.test(l)) ? "zh" : "en";
}
var lang = initial();
function pick(zh, en) {
  return lang === "zh" ? zh : en;
}

// src/app/platform.ts
var ua = navigator.userAgent;
var isIPadOS = /iPad/.test(ua) || /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
var isIOS = /iPhone|iPod/.test(ua) || isIPadOS;
var isMac = /Mac/.test(navigator.platform || ua) && !isIOS;
var isWindows = /Windows/.test(ua);
var isTouch = matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
var isStandalone = matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: window-controls-overlay)").matches || navigator.standalone === true;
var isDesktopShell = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
var isAndroid = /Android/.test(ua);
var isLinux = /Linux/.test(ua) && !isAndroid;
var isSafari = /^((?!chrome|android).)*safari/i.test(ua);
var isMobileUA = isIOS || isAndroid;
var tabletViewport = typeof matchMedia === "function" ? matchMedia("(min-width: 600px) and (min-height: 600px)") : null;
var isTablet = isMobileUA && (tabletViewport?.matches ?? false);
var isDesktopApp = isDesktopShell && !isMobileUA;

// src/app/http.ts
function shouldUseNativeFetch(shell, mockDesktop2) {
  return !shell || mockDesktop2;
}
var mockDesktop = typeof window !== "undefined" && "__morzMockInvoke" in window;
async function httpFetch(input, init) {
  if (shouldUseNativeFetch(isDesktopShell, mockDesktop)) return fetch(input, init);
  const { fetch: tauriFetch } = await Promise.resolve().then(() => (init_dist_js(), dist_js_exports));
  return tauriFetch(input, init);
}

// src/builtin/s3-client.ts
var encoder = new TextEncoder();
function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function sha256Hex(data) {
  const bytes = typeof data === "string" ? encoder.encode(data) : data instanceof Uint8Array ? data : new Uint8Array(data);
  return toHex(await crypto.subtle.digest("SHA-256", bytes));
}
async function hmac(key, data) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
}
function uriEncode(value, encodeSlash = true) {
  let out = "";
  for (const char of value) {
    if (/[A-Za-z0-9_.~-]/.test(char)) {
      out += char;
      continue;
    }
    if (char === "/" && !encodeSlash) {
      out += char;
      continue;
    }
    for (const byte of new TextEncoder().encode(char)) out += "%" + byte.toString(16).toUpperCase().padStart(2, "0");
  }
  return out;
}
function splitEndpoint(endpoint) {
  const url = new URL(endpoint);
  return {
    origin: `${url.protocol}//${url.host}`,
    basePath: url.pathname.replace(/\/+$/, ""),
    host: url.host
  };
}
function amzDate(now = /* @__PURE__ */ new Date()) {
  const iso = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return { stamp: iso, date: iso.slice(0, 8) };
}
async function sign(config, method, key, query = {}, payloadHash = "UNSIGNED-PAYLOAD", contentType) {
  const { basePath, host } = splitEndpoint(config.endpoint);
  const objectPath = key ? "/" + uriEncode(key, false) : "";
  const fullPath = (config.forcePathStyle ? `${basePath}/${config.bucket}` : basePath) + objectPath;
  const useVirtualHost = !config.forcePathStyle && !basePath;
  const requestHost = useVirtualHost ? `${config.bucket}.${host}` : host;
  const canonicalQuery = Object.keys(query).sort().map((name) => `${uriEncode(name)}=${uriEncode(query[name])}`).join("&");
  const { stamp, date } = amzDate();
  const headers = {
    host: requestHost,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": stamp
  };
  if (contentType) headers["content-type"] = contentType;
  const signedHeaders = Object.keys(headers).sort();
  const canonicalHeaders = signedHeaders.map((name) => `${name}:${headers[name]}
`).join("");
  const canonicalRequest = [
    method,
    fullPath || "/",
    canonicalQuery,
    canonicalHeaders,
    signedHeaders.join(";"),
    payloadHash
  ].join("\n");
  const scope = `${date}/${config.region}/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", stamp, scope, await sha256Hex(canonicalRequest)].join("\n");
  let signingKey = await hmac(encoder.encode("AWS4" + config.secretAccessKey), date);
  signingKey = await hmac(signingKey, config.region);
  signingKey = await hmac(signingKey, "s3");
  signingKey = await hmac(signingKey, "aws4_request");
  const signature = toHex(await hmac(signingKey, stringToSign));
  headers.authorization = `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${scope}, SignedHeaders=${signedHeaders.join(";")}, Signature=${signature}`;
  const sendHeaders = {};
  for (const [name, value] of Object.entries(headers)) if (name !== "host") sendHeaders[name] = value;
  const scheme = new URL(config.endpoint).protocol;
  return {
    url: `${scheme}//${requestHost}${fullPath || "/"}${canonicalQuery ? "?" + canonicalQuery : ""}`,
    headers: sendHeaders
  };
}
function publicUrl(config, key) {
  if (config.publicBaseUrl) {
    return config.publicBaseUrl.replace(/\/+$/, "") + "/" + uriEncode(key, false);
  }
  const { origin, basePath, host } = splitEndpoint(config.endpoint);
  const virtual = !config.forcePathStyle && !basePath;
  return virtual ? `${new URL(config.endpoint).protocol}//${config.bucket}.${host}${basePath}/${uriEncode(key, false)}` : `${origin}${basePath}/${config.bucket}/${uriEncode(key, false)}`;
}
async function putObject(config, key, body, contentType) {
  const bytes = new Uint8Array(await body.arrayBuffer());
  const request = await sign(config, "PUT", key, {}, await sha256Hex(bytes), contentType);
  const response = await fetch(request.url, { method: "PUT", headers: request.headers, body: bytes });
  if (!response.ok) throw new Error(`\u4E0A\u4F20\u5931\u8D25\uFF08HTTP ${response.status}\uFF09`);
}
async function listObjects(config, options = {}) {
  const query = {
    "list-type": "2",
    "max-keys": String(options.maxKeys ?? 500)
  };
  const prefix = (config.prefix ?? "") + (options.prefix ?? "");
  if (prefix) query.prefix = prefix;
  if (options.continuationToken) query["continuation-token"] = options.continuationToken;
  const request = await sign(config, "GET", "", query);
  const response = await fetch(request.url, { method: "GET", headers: request.headers });
  if (!response.ok) throw new Error(`\u8BFB\u53D6\u5217\u8868\u5931\u8D25\uFF08HTTP ${response.status}\uFF09`);
  const xml = new DOMParser().parseFromString(await response.text(), "application/xml");
  const keys = [...xml.querySelectorAll("Contents")].map((node) => ({
    key: node.querySelector("Key")?.textContent ?? "",
    size: Number(node.querySelector("Size")?.textContent ?? "0"),
    lastModified: node.querySelector("LastModified")?.textContent ?? ""
  })).filter((item) => item.key && !item.key.endsWith("/"));
  return {
    keys,
    truncated: xml.querySelector("IsTruncated")?.textContent === "true",
    nextToken: xml.querySelector("NextContinuationToken")?.textContent ?? void 0
  };
}
function isConfigured(config) {
  return Boolean(config?.endpoint && config.bucket && config.region && config.accessKeyId && config.secretAccessKey);
}

// src/builtin/lantai-client.ts
var LANTAI_BASE = "https://lantai.pkmer.cn";
function authHeaders(apiKey, extra = {}) {
  return { accept: "application/json", authorization: `Bearer ${apiKey}`, ...extra };
}
async function expectOk(response, what) {
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`${what}\u5931\u8D25\uFF08HTTP ${response.status}\uFF09${detail ? "\uFF1A" + detail.slice(0, 120) : ""}`);
  }
  const type = response.headers.get("content-type") ?? "";
  if (type.includes("text/html")) {
    throw new Error(`${what}\u5931\u8D25\uFF1A\u670D\u52A1\u7AEF\u8FD4\u56DE\u7684\u662F\u7F51\u9875\u800C\u4E0D\u662F API \u6570\u636E\uFF08\u63A5\u53E3\u8DEF\u5F84\u53EF\u80FD\u5DF2\u53D8\u66F4\uFF09`);
  }
  return response;
}
async function uploadToLanTai(apiKey, body, filename, base = LANTAI_BASE) {
  const response = await httpFetch(`${base}/api/v1/objects`, {
    method: "POST",
    headers: authHeaders(apiKey, {
      "content-type": body.type || "application/octet-stream",
      "x-lantai-name": filename
    }),
    body
  });
  await expectOk(response, "\u4E0A\u4F20");
  const payload = await response.json();
  if (!payload?.url) throw new Error("\u4E0A\u4F20\u6210\u529F\u4F46\u54CD\u5E94\u91CC\u6CA1\u6709 url");
  return { key: payload.key ?? filename, url: payload.url };
}
async function listLanTai(apiKey, options = {}, base = LANTAI_BASE) {
  const query = new URLSearchParams({ limit: String(options.limit ?? 100) });
  if (options.prefix) query.set("prefix", options.prefix);
  const response = await httpFetch(`${base}/api/v1/objects?${query}`, { headers: authHeaders(apiKey) });
  await expectOk(response, "\u8BFB\u53D6\u5217\u8868");
  const payload = await response.json();
  return (payload.items ?? []).map((item) => ({
    key: String(item.key ?? ""),
    size: Number(item.size ?? 0),
    url: typeof item.url === "string" ? item.url : void 0
  })).filter((item) => item.key);
}
async function lanTaiAccount(apiKey, base = LANTAI_BASE) {
  const response = await httpFetch(`${base}/api/v1/me`, { headers: authHeaders(apiKey) });
  await expectOk(response, "\u8FDE\u63A5");
  return await response.json();
}

// src/builtin/image-host.ts
var DEFAULTS = {
  provider: "lantai",
  picgoUrl: "http://127.0.0.1:36677",
  region: "us-east-1",
  prefix: "images/",
  keyTemplate: "{{date}}/{{filename}}.{{ext}}",
  deleteLocal: false,
  wikiLinks: false
};
var IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i;
function extensionOf(name) {
  const match = /\.([a-z0-9]+)$/i.exec(name);
  return (match?.[1] ?? "png").toLowerCase().replace("jpeg", "jpg");
}
function renderKey(template, filename, ext, docPath) {
  const now = /* @__PURE__ */ new Date();
  const pad = (value) => String(value).padStart(2, "0");
  const docName = docPath ? (docPath.split("/").pop() ?? "note").replace(/\.md$/i, "") : "note";
  const folder = docPath && docPath.includes("/") ? docPath.slice(0, docPath.lastIndexOf("/")) : "";
  return template.replace(/\{\{\s*filename\s*\}\}/g, filename).replace(/\{\{\s*ext\s*\}\}/g, ext).replace(/\{\{\s*docname\s*\}\}/g, docName).replace(/\{\{\s*folder\s*\}\}/g, folder || "root").replace(/\{\{\s*date\s*\}\}/g, `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`).replace(/\{\{\s*uuid\s*\}\}/g, crypto.randomUUID()).replace(/\{\{\s*random\s*\}\}/g, Math.random().toString(36).slice(2, 10)).replace(/^\/+/, "");
}
function wantsAutoUpload(text) {
  if (!text.startsWith("---")) return false;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return false;
  const head = text.slice(3, end).toLowerCase();
  return /typora-copy-images-to\s*:\s*["']?upload["']?/.test(head);
}
function s3Of(settings) {
  const config = {
    endpoint: String(settings.endpoint ?? ""),
    region: String(settings.region ?? ""),
    bucket: String(settings.bucket ?? ""),
    accessKeyId: String(settings.accessKeyId ?? ""),
    secretAccessKey: String(settings.secretAccessKey ?? ""),
    prefix: String(settings.prefix ?? ""),
    publicBaseUrl: settings.publicBaseUrl ? String(settings.publicBaseUrl) : void 0,
    forcePathStyle: settings.forcePathStyle === true
  };
  return isConfigured(config) ? config : null;
}
function resolveRelative(target, docPath) {
  const clean = target.replace(/^\.\//, "");
  if (clean.startsWith("/")) return clean.slice(1);
  const base = docPath && docPath.includes("/") ? docPath.slice(0, docPath.lastIndexOf("/")) : "";
  const out = [];
  for (const segment of `${base ? base + "/" : ""}${clean}`.split("/")) {
    if (!segment || segment === ".") continue;
    if (segment === "..") {
      out.pop();
      continue;
    }
    out.push(decodeURIComponent(segment));
  }
  return out.join("/");
}
function localImageRefs(text) {
  const out = [];
  for (const match of text.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const path = match[2];
    if (/^[a-z][a-z0-9+.-]*:/i.test(path)) continue;
    if (!IMAGE_EXT.test(path)) continue;
    out.push({ raw: match[0], path: decodeURIComponent(path), alt: match[1], wiki: false });
  }
  for (const match of text.matchAll(/!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g)) {
    const path = match[1].trim();
    if (!IMAGE_EXT.test(path)) continue;
    out.push({ raw: match[0], path, alt: path.split("/").pop() ?? path, wiki: true });
  }
  return out;
}
function remoteImageRefs(text) {
  const out = [];
  for (const match of text.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    out.push({ raw: match[0], url: match[2], alt: match[1] });
  }
  return out;
}
var imageHostPlugin = {
  manifest: {
    id: "image-host",
    name: pick("\u56FE\u5E8A", "Image host"),
    version: "1.0.0",
    description: pick("S3 \u517C\u5BB9\u7684\u56FE\u7247\u4E0A\u4F20\uFF1A\u63D2\u5165\u5373\u4E0A\u4F20\u3001\u6279\u91CF\u4E0A\u4F20\u3001\u8FDC\u7A0B\u56FE\u672C\u5730\u5316\u3001\u56FE\u5E93\u6D4F\u89C8", "S3-compatible image upload: upload on insert, batch upload, localise remote images, gallery"),
    author: "Morz",
    permissions: ["vault:read", "vault:write", "workspace", "settings", "editor:insert"],
    defaultEnabled: false
  },
  async activate(ctx) {
    const readSettings = async () => {
      const stored = await ctx.settings.get();
      const merged = { ...DEFAULTS, ...stored };
      if (!stored.uploadMode && stored.yamlOnly === true) merged.uploadMode = "yaml";
      return merged;
    };
    const apiKeyOf = async (settings) => String(settings.apiKey ?? "").trim();
    const configProblem = (settings) => {
      if (settings.provider === "lantai") {
        return String(settings.apiKey ?? "").trim() ? null : pick("\u5148\u586B\u5170\u53F0 API Key", "Fill in the LanTai API key first");
      }
      if (settings.provider === "picgo") {
        return isDesktopApp ? null : pick("PicGo \u53EA\u5728\u684C\u9762\u7248\u53EF\u7528", "PicGo is only available in the desktop app");
      }
      return s3Of(settings) ? null : pick("\u56FE\u5E8A\u8FD8\u6CA1\u586B Endpoint / Bucket / \u5BC6\u94A5", "Fill in the endpoint, bucket and keys first");
    };
    const uploadBlob = async (settings, blob, filename, ext, docPath) => {
      const problem = configProblem(settings);
      if (problem) throw new Error(problem);
      if (settings.provider === "lantai") {
        const apiKey = await apiKeyOf(settings);
        return (await uploadToLanTai(apiKey, blob, `${filename}.${ext}`)).url;
      }
      if (settings.provider === "picgo") {
        const base = (settings.picgoUrl || DEFAULTS.picgoUrl).replace(/\/+$/, "");
        const { invoke: invoke2 } = await Promise.resolve().then(() => (init_core(), core_exports));
        const tempDir = (await invoke2("temp_file_dir")).replace(/[\\/]+$/, "");
        const tempPath = `${tempDir}/picgo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const bytes = new Uint8Array(await blob.arrayBuffer());
        await invoke2("write_file_bytes", { path: tempPath, bytes: Array.from(bytes) });
        try {
          const response = await httpFetch(`${base}/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ list: [tempPath] })
          });
          const payload = await response.json().catch(() => null);
          const url = payload?.success ? String(payload.result?.[0] ?? "") : "";
          if (!url) throw new Error(pick("PicGo \u6CA1\u6709\u8FD4\u56DE\u56FE\u7247\u5730\u5740", "PicGo returned no URL"));
          return url;
        } finally {
          invoke2("remove_path", { path: tempPath }).catch(() => void 0);
        }
      }
      const s3 = s3Of(settings);
      const key = String(s3.prefix ?? "") + renderKey(settings.keyTemplate ?? DEFAULTS.keyTemplate, filename, ext, docPath);
      await putObject(s3, key, blob, blob.type || `image/${ext}`);
      return publicUrl(s3, key);
    };
    const schema = [
      {
        key: "provider",
        label: pick("\u56FE\u5E8A\u7C7B\u578B", "Provider"),
        type: "select",
        options: [
          ["lantai", pick("\u5170\u53F0\uFF08PKMer \u4E91\uFF09", "LanTai (PKMer cloud)")],
          ["s3", pick("S3 \u517C\u5BB9\uFF08\u81EA\u5EFA/\u7B2C\u4E09\u65B9\uFF09", "S3-compatible")],
          ["picgo", pick("PicGo\uFF08\u672C\u673A\u5BA2\u6237\u7AEF\uFF09", "PicGo (local client)")]
        ]
      },
      // 下面按 provider 分组：showIf 让表单只显示当前图床用得上的配置
      { key: "picgoUrl", label: pick("PicGo Server \u5730\u5740", "PicGo Server URL"), type: "text", placeholder: "http://127.0.0.1:36677", showIf: { key: "provider", equals: "picgo" } },
      { key: "apiKey", label: pick("\u5170\u53F0 API Key", "LanTai API key"), type: "password", secret: true, placeholder: "\u5728 lantai.pkmer.cn/settings?tab=api-keys \u751F\u6210", showIf: { key: "provider", equals: "lantai" } },
      { key: "endpoint", label: "Endpoint", type: "text", placeholder: "https://s3.us-east-1.amazonaws.com", showIf: { key: "provider", equals: "s3" } },
      { key: "region", label: "Region", type: "text", placeholder: "us-east-1", showIf: { key: "provider", equals: "s3" } },
      { key: "bucket", label: "Bucket", type: "text", placeholder: "my-notes", showIf: { key: "provider", equals: "s3" } },
      { key: "accessKeyId", label: "Access Key ID", type: "password", secret: true, showIf: { key: "provider", equals: "s3" } },
      { key: "secretAccessKey", label: "Secret Access Key", type: "password", secret: true, showIf: { key: "provider", equals: "s3" } },
      { key: "prefix", label: pick("\u5BF9\u8C61\u524D\u7F00", "Object prefix"), type: "text", placeholder: "images/", showIf: { key: "provider", equals: "s3" } },
      { key: "publicBaseUrl", label: pick("\u516C\u5F00\u8BBF\u95EE\u57FA\u5740\uFF08\u53EF\u9009\uFF09", "Public base URL (optional)"), type: "text", placeholder: "https://cdn.example.com", showIf: { key: "provider", equals: "s3" } },
      { key: "forcePathStyle", label: pick("\u8DEF\u5F84\u98CE\u683C\uFF08MinIO \u9700\u8981\uFF09", "Path-style URLs (required by MinIO)"), type: "boolean", showIf: { key: "provider", equals: "s3" } },
      { key: "keyTemplate", label: pick("\u5BF9\u8C61\u952E\u6A21\u677F", "Object key template"), type: "text", placeholder: "{{date}}/{{filename}}.{{ext}}", showIf: { key: "provider", equals: "s3" } },
      { key: "deleteLocal", label: pick("\u4E0A\u4F20\u540E\u5220\u9664\u672C\u5730\u6587\u4EF6", "Delete the local file after upload"), type: "boolean" },
      // 仅本地落盘与远端 URL 的插入写法有关；PicGo/兰台都用远端 URL
      { key: "wikiLinks", label: pick("\u672C\u5730\u56FE\u7247\u7528 wiki \u94FE\u63A5", "Use wiki links for local images"), type: "boolean" },
      {
        key: "uploadMode",
        label: pick("\u63D2\u5165\u56FE\u7247\u65F6", "When inserting an image"),
        type: "select",
        options: [
          ["manual", pick("\u4E0D\u81EA\u52A8\u4E0A\u4F20\uFF08\u624B\u52A8\u547D\u4EE4\uFF09", "No automatic upload (manual command)")],
          ["auto", pick("\u81EA\u52A8\u4E0A\u4F20", "Upload automatically")],
          ["yaml", pick("\u4EC5\u5199\u4E86 typora-copy-images-to: upload \u7684\u7B14\u8BB0", "Only notes with typora-copy-images-to: upload")]
        ]
      }
    ];
    ctx.settings.defineSchema(schema);
    let yamlHintShown = false;
    ctx.settings.onChange(() => {
      void readSettings().then((settings) => {
        if (settings.uploadMode !== "yaml" || yamlHintShown) return;
        yamlHintShown = true;
        ctx.ui.notice(pick(
          "\u5728\u7B14\u8BB0\u5F00\u5934\u7684 frontmatter \u91CC\u52A0\u4E00\u884C typora-copy-images-to: upload\uFF0C\u8FD9\u7BC7\u7B14\u8BB0\u63D2\u5165\u56FE\u7247\u65F6\u624D\u4F1A\u81EA\u52A8\u4E0A\u4F20\u3002",
          "Add `typora-copy-images-to: upload` to the note's front matter to auto-upload images inserted there."
        ), { timeout: 1e4 });
      });
    });
    ctx.images.registerUploader({
      id: "s3",
      name: pick("S3 \u56FE\u5E8A", "S3 image host"),
      async upload(file, context) {
        const settings = await readSettings();
        const mode = settings.uploadMode ?? "manual";
        if (mode === "manual") return null;
        if (mode === "yaml" && !wantsAutoUpload(ctx.active.text())) return null;
        const original = context.name || "image.png";
        const filename = original.replace(/\.[^.]+$/, "") || "image";
        const ext = extensionOf(original);
        try {
          return await uploadBlob(settings, file, filename, ext, context.docPath);
        } catch {
          return null;
        }
      }
    });
    ctx.ui.command({
      id: "upload-local-images",
      name: pick("\u4E0A\u4F20\u672C\u6587\u6240\u6709\u672C\u5730\u56FE\u7247", "Upload all local images in this document"),
      async run() {
        const settings = await readSettings();
        const problem = configProblem(settings);
        if (problem) {
          ctx.ui.notice(problem, { kind: "error" });
          return;
        }
        const text = ctx.active.text();
        const docPath = ctx.active.path();
        const refs = localImageRefs(text);
        if (!refs.length) {
          ctx.ui.notice(pick("\u6CA1\u6709\u627E\u5230\u672C\u5730\u56FE\u7247", "No local images found"));
          return;
        }
        let next = text;
        let done = 0;
        for (const ref of refs) {
          try {
            const blob = await ctx.vault.readBlob(resolveRelative(ref.path, docPath));
            if (!blob) continue;
            const filename = (ref.path.split("/").pop() ?? "image").replace(/\.[^.]+$/, "");
            const ext = extensionOf(ref.path);
            const url = await uploadBlob(settings, blob, filename, ext, docPath);
            next = next.split(ref.raw).join(`![${ref.alt}](${url})`);
            if (settings.deleteLocal) await ctx.vault.remove(ref.path).catch(() => void 0);
            done++;
          } catch (error) {
            ctx.ui.notice(pick(`\u201C${ref.path}\u201D \u4E0A\u4F20\u5931\u8D25\uFF1A`, `Could not upload \u201C${ref.path}\u201D: `) + (error instanceof Error ? error.message : error), { kind: "error" });
          }
        }
        if (done) ctx.active.setText(next);
        ctx.ui.notice(pick(`\u5DF2\u4E0A\u4F20 ${done}/${refs.length} \u5F20\u56FE\u7247`, `Uploaded ${done}/${refs.length} images`));
      }
    });
    ctx.ui.command({
      id: "localize-images",
      name: pick("\u628A\u672C\u6587\u8FDC\u7A0B\u56FE\u7247\u672C\u5730\u5316", "Download remote images in this document"),
      async run() {
        const text = ctx.active.text();
        const docPath = ctx.active.path();
        const refs = remoteImageRefs(text);
        if (!refs.length) {
          ctx.ui.notice(pick("\u6CA1\u6709\u627E\u5230\u8FDC\u7A0B\u56FE\u7247", "No remote images found"));
          return;
        }
        const folder = docPath && docPath.includes("/") ? docPath.slice(0, docPath.lastIndexOf("/")) : "";
        let next = text;
        let done = 0;
        for (const ref of refs) {
          try {
            const response = await fetch(ref.url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const blob = await response.blob();
            const name = (ref.url.split("/").pop() ?? "image").split("?")[0] || `image-${Date.now()}`;
            const ext = IMAGE_EXT.test(name) ? "" : ".png";
            const path = (folder ? folder + "/" : "") + "assets/" + decodeURIComponent(name) + ext;
            await ctx.vault.writeBlob(path, blob);
            const link = (folder ? "" : "") + (path.startsWith(folder + "/") ? path.slice(folder.length + 1) : path);
            next = next.split(ref.raw).join(`![${ref.alt}](${link})`);
            done++;
          } catch (error) {
            ctx.ui.notice(pick(`\u201C${ref.url}\u201D \u672C\u5730\u5316\u5931\u8D25\uFF1A`, `Could not download \u201C${ref.url}\u201D: `) + (error instanceof Error ? error.message : error), { kind: "error" });
          }
        }
        if (done) ctx.active.setText(next);
        ctx.ui.notice(pick(`\u5DF2\u672C\u5730\u5316 ${done}/${refs.length} \u5F20\u56FE\u7247`, `Kept ${done}/${refs.length} images locally`));
      }
    });
    ctx.ui.panel({
      id: "gallery",
      name: pick("\u56FE\u5E93", "Gallery"),
      icon: '<path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/>',
      render: () => renderGallery(ctx, readSettings)
    });
    ctx.ui.command({
      id: "import-lantai",
      name: pick("\u4ECE\u5170\u53F0\u5BFC\u5165\u914D\u7F6E", "Import settings from LanTai"),
      async run() {
        const candidates = [
          ".obsidian/plugins/lantai/data.json",
          ".obsidian/plugins/obsidian-LanTai/data.json",
          ".obsidian/plugins/LanTai/data.json"
        ];
        let raw = null;
        let from = "";
        for (const path of candidates) {
          try {
            raw = await ctx.vault.read(path);
            from = path;
            break;
          } catch {
          }
        }
        if (!raw) {
          ctx.ui.notice(pick("\u6CA1\u627E\u5230\u5170\u53F0\u7684 data.json\uFF08\u9700\u8981\u5148\u6253\u5F00 Obsidian \u5E93\u6240\u5728\u7684\u6587\u4EF6\u5939\uFF09", "LanTai data.json was not found (open the Obsidian vault folder first)"), { kind: "error", timeout: 1e4 });
          return;
        }
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          ctx.ui.notice(pick("\u5170\u53F0\u7684 data.json \u4E0D\u662F\u5408\u6CD5 JSON", "LanTai data.json is not valid JSON"), { kind: "error" });
          return;
        }
        const profiles = data.profiles ?? [];
        const active = profiles.find((item) => item.id === data.activeProfileId) ?? profiles[0];
        const convertTemplate = (template) => template.replace(/\$\{\s*originalName\s*\}/g, "{{filename}}").replace(/\$\{\s*ext\s*\}/g, "{{ext}}").replace(/\$\{\s*uuid\s*\}/g, "{{uuid}}").replace(/\$\{\s*random\s*\}/g, "{{random}}").replace(/\$\{\s*(?:date|datetime)[^}]*\}/g, "{{date}}").replace(/\$\{\s*noteName\s*\}/g, "{{docname}}");
        const patch = {};
        const imported = [];
        if (active) {
          patch.provider = active.provider === "lantai" ? "lantai" : "s3";
          imported.push(patch.provider === "lantai" ? "\u5170\u53F0" : "S3");
          for (const [source, target] of [
            ["bucket", "bucket"],
            ["endpoint", "endpoint"],
            ["region", "region"],
            ["publicBaseUrl", "publicBaseUrl"]
          ]) {
            const value = active[source];
            if (typeof value === "string" && value.trim()) {
              patch[target] = value.trim();
              imported.push(target);
            }
          }
          if (typeof active.objectKeyTemplate === "string") {
            patch.keyTemplate = convertTemplate(active.objectKeyTemplate);
            imported.push("keyTemplate");
          }
        }
        if (data.linkStyle === "wiki") {
          patch.wikiLinks = true;
          imported.push("wikiLinks");
        }
        if (data.deleteSourceAfterUpload === true) {
          patch.deleteLocal = true;
          imported.push("deleteLocal");
        }
        await ctx.settings.set(patch);
        ctx.ui.notice(
          `\u5DF2\u4ECE\u5170\u53F0\u5BFC\u5165\uFF1A${imported.join("\u3001") || "\uFF08\u6CA1\u6709\u53EF\u7528\u5B57\u6BB5\uFF09"}\u3002\u5BC6\u94A5\u5B58\u5728 Obsidian \u7684 Secret Storage \u91CC\uFF0C\u5BFC\u4E0D\u51FA\u6765\u2014\u2014\u8BF7\u5728\u8FD9\u91CC\u624B\u52A8\u586B API Key \u6216 AK/SK\u3002`,
          { timeout: 12e3 }
        );
        void from;
      }
    });
    const currentLocalImage = (pos) => {
      try {
        const text = ctx.active.text();
        const lineIndex = typeof pos === "number" ? text.slice(0, Math.max(0, Math.min(pos, text.length))).split("\n").length - 1 : ctx.active.cursor().line - 1;
        const line = text.split("\n")[lineIndex] ?? "";
        return localImageRefs(text).find((item) => line.includes(item.raw)) ?? null;
      } catch {
        return null;
      }
    };
    const uploadCurrentImage = async (pos) => {
      const settings = await readSettings();
      const problem = configProblem(settings);
      if (problem) {
        ctx.ui.notice(problem, { kind: "error" });
        return;
      }
      const ref = currentLocalImage(pos);
      if (!ref) {
        ctx.ui.notice(pick("\u5149\u6807\u6240\u5728\u884C\u6CA1\u6709\u672C\u5730\u56FE\u7247", "There is no local image on this line"));
        return;
      }
      try {
        const text = ctx.active.text();
        const blob = await ctx.vault.readBlob(resolveRelative(ref.path, ctx.active.path()));
        if (!blob) {
          ctx.ui.notice(pick(`\u8BFB\u4E0D\u5230 \u201C${ref.path}\u201D`, `Could not read \u201C${ref.path}\u201D`), { kind: "error" });
          return;
        }
        const filename = (ref.path.split("/").pop() ?? "image").replace(/\.[^.]+$/, "");
        const ext = extensionOf(ref.path);
        const href = await uploadBlob(settings, blob, filename, ext, ctx.active.path());
        ctx.active.setText(text.split(ref.raw).join(`![${ref.alt}](${href})`));
        if (settings.deleteLocal) await ctx.vault.remove(resolveRelative(ref.path, ctx.active.path())).catch(() => void 0);
        ctx.ui.notice(pick("\u5DF2\u4E0A\u4F20", "Uploaded"));
      } catch (error) {
        ctx.ui.notice(pick("\u4E0A\u4F20\u5931\u8D25\uFF1A", "Upload failed: ") + (error instanceof Error ? error.message : error), { kind: "error" });
      }
    };
    ctx.ui.command({
      id: "upload-current-image",
      name: pick("\u4E0A\u4F20\u5149\u6807\u5904\u7684\u56FE\u7247", "Upload the image at the cursor"),
      run: uploadCurrentImage
    });
    ctx.ui.menu({
      label: pick("\u4E0A\u4F20\u5F53\u524D\u56FE\u7247\u5230\u56FE\u5E8A", "Upload image to image host"),
      icon: "upload",
      when: "editor",
      enabled: (pos) => !!currentLocalImage(pos),
      run: (pos) => uploadCurrentImage(pos)
    });
    ctx.ui.command({
      id: "clear-credentials",
      name: "\u6E05\u9664\u56FE\u5E8A\u5BC6\u94A5",
      async run() {
        await ctx.settings.set({ apiKey: "", accessKeyId: "", secretAccessKey: "" });
        ctx.ui.notice(pick("\u5DF2\u6E05\u9664\u4FDD\u5B58\u7684\u56FE\u5E8A\u5BC6\u94A5", "Saved image-host keys were cleared"));
      }
    });
    ctx.ui.command({
      id: "test-upload",
      name: "\u6D4B\u8BD5\u56FE\u5E8A\u914D\u7F6E",
      async run() {
        const settings = await readSettings();
        const png = () => Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="), (c) => c.charCodeAt(0));
        if (settings.provider === "lantai") {
          const apiKey = String(settings.apiKey ?? "").trim();
          if (!apiKey) {
            ctx.ui.notice(pick("\u5148\u586B\u5170\u53F0 API Key\uFF08\u5728 lantai.pkmer.cn/settings?tab=api-keys \u751F\u6210\uFF09", "Fill in the LanTai API key first (create one at lantai.pkmer.cn/settings?tab=api-keys)"), { kind: "error" });
            return;
          }
          try {
            const account = await lanTaiAccount(apiKey);
            ctx.ui.notice(pick("\u5170\u53F0\u8FDE\u63A5\u6B63\u5E38", "LanTai connection OK") + (account?.name ? ": " + account.name : ""), { timeout: 1e4 });
          } catch (error) {
            ctx.ui.notice(pick("\u5170\u53F0\u8FDE\u63A5\u5931\u8D25\uFF1A", "LanTai connection failed: ") + (error instanceof Error ? error.message : error), { kind: "error", timeout: 15e3 });
          }
          return;
        }
        if (settings.provider === "picgo") {
          try {
            const url = await uploadBlob(settings, new Blob([png()], { type: "image/png" }), "test", "png", null);
            ctx.ui.notice(pick("\u4E0A\u4F20\u6210\u529F\uFF1A", "Uploaded: ") + url, { timeout: 12e3 });
          } catch (error) {
            ctx.ui.notice(pick("PicGo \u8FDE\u63A5\u5931\u8D25\uFF1A", "PicGo connection failed: ") + (error instanceof Error ? error.message : error) + pick("\u3002\u786E\u8BA4 PicGo \u5DF2\u542F\u52A8\u5E76\u5F00\u542F\u4E86 Server\u3002", ". Make sure PicGo is running with its server enabled."), { kind: "error", timeout: 15e3 });
          }
          return;
        }
        const s3 = s3Of(settings);
        if (!s3) {
          ctx.ui.notice(pick("\u914D\u7F6E\u4E0D\u5B8C\u6574\uFF1Aendpoint / region / bucket / AK / SK \u90FD\u8981\u586B", "Incomplete: endpoint, region, bucket, access key and secret are all required"), { kind: "error" });
          return;
        }
        const key = String(s3.prefix ?? "") + renderKey("{{date}}/test-{{random}}.png", "test", "png", ctx.active.path());
        try {
          await putObject(s3, key, new Blob([png()], { type: "image/png" }), "image/png");
          const url = publicUrl(s3, key);
          ctx.ui.notice(pick("\u4E0A\u4F20\u6210\u529F\uFF1A", "Uploaded: ") + url, { timeout: 12e3 });
        } catch (error) {
          ctx.ui.notice(pick("\u4E0A\u4F20\u5931\u8D25\uFF1A", "Upload failed: ") + (error instanceof Error ? error.message : error) + pick("\u3002\u68C0\u67E5 AK/SK\u3001region\uFF0C\u4EE5\u53CA bucket \u7684 CORS \u662F\u5426\u5141\u8BB8\u672C\u7AD9\u70B9\u3002", ". Check the access keys, region, and that the bucket CORS allows this site."), { kind: "error", timeout: 15e3 });
        }
      }
    });
    ctx.ui.command({
      id: "image-host-settings",
      name: "\u56FE\u5E8A\u8BBE\u7F6E",
      run: () => ctx.settings.openForm(schema)
    });
  }
};
function renderGallery(ctx, readSettings) {
  const RENDER_LIMIT = 120;
  const S3_PAGE = 500;
  const LANTAI_PAGE = 300;
  const root = document.createElement("div");
  root.className = "rp-gallery";
  const style = document.createElement("style");
  style.textContent = `
    .rp-gallery { padding: 8px; font-size: 13px; }
    .rp-gallery .gallery-head { display: flex; gap: 6px; align-items: center; margin-bottom: 8px; }
    .rp-gallery .gallery-head > span { flex: none; }
    .rp-gallery .gallery-search { flex: 1; min-width: 0; padding: 3px 6px; font-size: 12px; }
    .rp-gallery .gallery-status { margin: 0 0 8px; color: var(--ui-muted, #8a8f98); font-size: 0.86em; }
    .rp-gallery .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 6px; }
    .rp-gallery .gallery-item { border: 1px solid var(--ui-border, #dfe2e5); border-radius: 6px; overflow: hidden; cursor: pointer; background: transparent; padding: 0; }
    .rp-gallery .gallery-item img { display: block; width: 100%; aspect-ratio: 1; object-fit: cover; }
    .rp-gallery .gallery-note { padding: 10px 2px; color: var(--ui-muted, #8a8f98); font-size: 0.9em; line-height: 1.6; }
    .rp-gallery .gallery-more { width: 100%; margin-top: 8px; }
  `;
  root.append(style);
  const note = (text) => {
    const element = document.createElement("div");
    element.className = "gallery-note";
    element.textContent = text;
    return element;
  };
  let all = [];
  let query = "";
  let nextToken;
  let truncated = false;
  let capped = false;
  const head = document.createElement("div");
  head.className = "gallery-head";
  const label = document.createElement("span");
  const search = document.createElement("input");
  search.type = "search";
  search.className = "gallery-search text-input";
  search.placeholder = pick("\u641C\u7D22\u6587\u4EF6\u540D\u2026", "Search file names\u2026");
  const reload = document.createElement("button");
  reload.className = "gallery-reload text-input";
  reload.textContent = pick("\u5237\u65B0", "Refresh");
  head.append(label, search, reload);
  const status = document.createElement("div");
  status.className = "gallery-status";
  const body = document.createElement("div");
  body.className = "gallery-body";
  root.append(head, status, body);
  const insert = (item, s3) => {
    const settings = ctx.settings;
    void settings.get().then((current) => {
      const href = item.url ?? (s3 ? publicUrl(s3, item.key) : item.key);
      const link = current.wikiLinks ? `![[${item.key}]]` : `![${item.key.split("/").pop() ?? item.key}](${href})`;
      try {
        ctx.active.insert(link);
      } catch (error) {
        ctx.ui.notice(pick("\u63D2\u5165\u5931\u8D25\uFF1A", "Could not insert: ") + (error instanceof Error ? error.message : error), { kind: "error" });
      }
    }).catch((error) => {
      ctx.ui.notice(pick("\u63D2\u5165\u5931\u8D25\uFF1A", "Could not insert: ") + (error instanceof Error ? error.message : error), { kind: "error" });
    });
  };
  let paint = () => {
  };
  const refresh = async (append = false) => {
    const settings = await readSettings();
    const isLanTai = settings.provider === "lantai";
    if (settings.provider === "picgo") {
      head.remove();
      status.remove();
      body.replaceChildren(note(pick("PicGo \u6CA1\u6709\u53EF\u6D4F\u89C8\u7684\u56FE\u5E93\uFF1A\u56FE\u5E93\u53EA\u652F\u6301\u5170\u53F0\u548C S3\u3002", "PicGo has no browsable library \u2014 the gallery works with LanTai and S3 only.")));
      return;
    }
    const apiKey = String(settings.apiKey ?? "").trim();
    const s3 = isLanTai ? null : s3Of(settings);
    if (isLanTai ? !apiKey : !s3) {
      head.remove();
      status.remove();
      body.replaceChildren(note(isLanTai ? pick("\u5148\u5728\u300C\u56FE\u5E8A\u8BBE\u7F6E\u300D\u91CC\u586B\u597D\u5170\u53F0 API Key\u3002", "Fill in the LanTai API key in the image-host settings first.") : pick("\u5148\u5728\u300C\u56FE\u5E8A\u8BBE\u7F6E\u300D\u91CC\u586B\u597D S3 \u914D\u7F6E\u3002", "Fill in the S3 settings first.")));
      return;
    }
    label.textContent = isLanTai ? pick("\u5170\u53F0", "LanTai") : s3.bucket;
    status.textContent = pick("\u8BFB\u53D6\u4E2D\u2026", "Loading\u2026");
    try {
      let items;
      if (isLanTai) {
        const listed = await listLanTai(apiKey, { limit: LANTAI_PAGE });
        items = listed.filter((item) => IMAGE_EXT.test(item.key)).map((item) => ({ key: item.key, size: item.size, url: item.url }));
        truncated = false;
        capped = listed.length >= LANTAI_PAGE;
      } else {
        const page = await listObjects(s3, { prefix: "", maxKeys: S3_PAGE, continuationToken: append ? nextToken : void 0 });
        items = page.keys.filter((item) => IMAGE_EXT.test(item.key)).map((item) => ({ key: item.key, size: item.size, url: void 0 }));
        truncated = page.truncated;
        nextToken = page.nextToken;
        capped = false;
      }
      all = append ? all.concat(items) : items;
      paint(s3);
    } catch (error) {
      body.replaceChildren(note(`${pick("\u8BFB\u53D6\u5931\u8D25\uFF1A", "Could not load: ")}${error instanceof Error ? error.message : error}`));
    }
  };
  paint = (s3) => {
    body.replaceChildren();
    if (!all.length) {
      status.textContent = "";
      body.append(note(pick("\u8FD8\u6CA1\u6709\u56FE\u7247\u3002", "No images yet.")));
      return;
    }
    const matches = query ? all.filter((item) => item.key.toLowerCase().includes(query)) : all;
    const parts = [query ? `${pick("\u5339\u914D", "Matched")} ${matches.length} / ${all.length}` : `${pick("\u5171", "Total")} ${all.length} ${pick("\u5F20", "images")}`];
    if (matches.length > RENDER_LIMIT) parts.push(pick(`\u53EA\u663E\u793A\u524D ${RENDER_LIMIT} \u5F20`, `showing first ${RENDER_LIMIT}`));
    if (capped) parts.push(pick("\u53EF\u80FD\u8FD8\u6709\u66F4\u591A", "possibly more"));
    status.textContent = parts.join(" \xB7 ");
    if (!matches.length) {
      body.append(note(pick("\u6CA1\u6709\u5339\u914D\u7684\u56FE\u7247\u3002", "No matching images.")));
      return;
    }
    const grid = document.createElement("div");
    grid.className = "gallery-grid";
    for (const item of matches.slice(0, RENDER_LIMIT)) {
      const button = document.createElement("button");
      button.className = "gallery-item";
      button.title = `${item.key} \xB7 ${Math.round(item.size / 1024)}KB`;
      const img = document.createElement("img");
      img.loading = "lazy";
      img.src = item.url ?? (s3 ? publicUrl(s3, item.key) : "");
      img.alt = item.key;
      button.append(img);
      button.addEventListener("click", () => insert(item, s3));
      grid.append(button);
    }
    body.append(grid);
    if (truncated && !query) {
      const more = document.createElement("button");
      more.className = "gallery-more text-input";
      more.textContent = pick("\u52A0\u8F7D\u66F4\u591A", "Load more");
      more.addEventListener("click", () => {
        more.disabled = true;
        void refresh(true);
      });
      body.append(more);
    }
  };
  search.addEventListener("input", () => {
    query = search.value.trim().toLowerCase();
    if (!all.length) return;
    void readSettings().then((settings) => {
      const s3 = settings.provider === "lantai" ? null : s3Of(settings);
      paint(s3);
    });
  });
  reload.addEventListener("click", () => {
    void refresh(false);
  });
  void refresh(false);
  return root;
}

// scripts/image-host-entry.ts
var activate = imageHostPlugin.activate.bind(imageHostPlugin);
