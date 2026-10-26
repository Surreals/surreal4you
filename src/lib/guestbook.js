import { promises as fs } from "fs";
import path from "path";
import { createHash, randomUUID } from "crypto";
import { del, get, list, put } from "@vercel/blob";

// Visitor lines for the station log.
//
// Storage shape (Vercel Blob, private; or files under .data/ in dev):
//   guestbook/pending/<who>/<id>.json    one blob per line — adding a line
//   guestbook/approved/<who>/<id>.json   never rewrites anyone else's, so
//                                        visitors cannot race each other or
//                                        undo a moderation decision; the
//                                        status is the folder, so caps are
//                                        a cheap prefix count
//   guestbook/feed.json                  the public feed, rebuilt only by
//                                        admin actions (single writer)
// Nothing here is reachable by URL: private blobs need the store token.
const ROOT = "guestbook/";
const FEED = "guestbook/feed.json";
const STATUSES = ["pending", "approved"];

export const MAX_LEN = 80;
export const MIN_LEN = 2;
export const MAX_PENDING = 300; // lines waiting for review, in total
export const MAX_PENDING_PER_VISITOR = 10; // waiting lines one visitor hash may hold
export const PUBLIC_LIMIT = 40;

const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const BLOB = { access: "private" };

const safeId = (s) => /^[a-f0-9-]{8,64}$/.test(String(s ?? ""));
const safeWho = (s) => /^[a-f0-9]{8}$/.test(String(s ?? ""));

const normalizeEntry = (e) =>
  e && typeof e.id === "string" && typeof e.msg === "string"
    ? {
        id: e.id,
        msg: e.msg,
        at: typeof e.at === "string" ? e.at : new Date(0).toISOString(),
        who: typeof e.who === "string" ? e.who : "",
        status: e.status === "approved" ? "approved" : "pending",
      }
    : null;

// --- low-level store -------------------------------------------------------

async function readJson(pathname) {
  if (hasBlob()) {
    const res = await get(pathname, { ...BLOB, useCache: false });
    if (!res?.blob) return null;
    return JSON.parse(await res.blob.text());
  }
  const raw = await fs.readFile(path.join(process.cwd(), ".data", pathname), "utf8").catch(() => null);
  return raw ? JSON.parse(raw) : null;
}

async function writeJson(pathname, data) {
  const body = JSON.stringify(data, null, 2);
  if (hasBlob()) {
    await put(pathname, body, {
      ...BLOB,
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    return;
  }
  const file = path.join(process.cwd(), ".data", pathname);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, body, "utf8");
}

async function removeJson(pathname) {
  if (hasBlob()) {
    await del(pathname, BLOB);
    return;
  }
  await fs.rm(path.join(process.cwd(), ".data", pathname), { force: true });
}

// Pathnames under a prefix, all pages.
async function listPaths(prefix) {
  if (hasBlob()) {
    const out = [];
    let cursor;
    do {
      const page = await list({ ...BLOB, prefix, cursor, limit: 1000 });
      out.push(...page.blobs.map((b) => b.pathname));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return out;
  }
  const root = path.join(process.cwd(), ".data", prefix);
  const out = [];
  const walk = async (dir) => {
    const items = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const it of items) {
      const p = path.join(dir, it.name);
      if (it.isDirectory()) await walk(p);
      else if (it.name.endsWith(".json")) out.push(path.relative(path.join(process.cwd(), ".data"), p).split(path.sep).join("/"));
    }
  };
  await walk(root);
  return out;
}

async function readMany(paths, concurrency = 8) {
  const out = [];
  for (let i = 0; i < paths.length; i += concurrency) {
    const chunk = await Promise.all(paths.slice(i, i + concurrency).map((p) => readJson(p).catch(() => null)));
    out.push(...chunk.map(normalizeEntry).filter(Boolean));
  }
  return out;
}

const entryPath = (status, who, id) => `${ROOT}${status}/${who}/${id}.json`;

// --- public API --------------------------------------------------------------

// Every line, newest first. Admin only — it reads one blob per line.
export async function readGuestbook() {
  const paths = (await Promise.all(STATUSES.map((st) => listPaths(`${ROOT}${st}/`)))).flat();
  const entries = await readMany(paths);
  entries.sort((a, b) => (a.at < b.at ? 1 : -1));
  return { entries };
}

// Lowercase, single-spaced, no control characters, no links. The log is one
// voice; a visitor's line has to sit in it without standing out.
export function cleanLine(input) {
  const s = String(input ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  if (s.length < MIN_LEN || s.length > MAX_LEN) return null;
  if (/https?:\/\/|www\.|\.(com|net|org|ua|ru|io|me|ly)\b|@/i.test(s)) return null;
  return s;
}

// A stable, anonymous visitor hash: enough to see repeat posters in the
// admin and to cap them, never the address itself.
export function visitorHash(ip) {
  return createHash("sha256")
    .update(`${process.env.AUTH_SECRET ?? "srrl"}:${ip ?? ""}`)
    .digest("hex")
    .slice(0, 8);
}

// Returns the entry, or a string naming why it was refused. Only lines
// still waiting count against the caps: approved history never locks the
// queue, and a visitor whose lines were reviewed can write again.
export async function addGuestLine(msg, who) {
  if (!safeWho(who)) return "bad visitor";
  const [mine, all] = await Promise.all([
    listPaths(`${ROOT}pending/${who}/`),
    listPaths(`${ROOT}pending/`),
  ]);
  if (mine.length >= MAX_PENDING_PER_VISITOR) return "visitor cap";
  if (all.length >= MAX_PENDING) return "queue full";
  const entry = { id: randomUUID(), msg, at: new Date().toISOString(), who, status: "pending" };
  await writeJson(entryPath("pending", who, entry.id), entry);
  return entry;
}

// The public feed: approved lines only, as last rebuilt by an admin action.
export async function approvedLines(limit = PUBLIC_LIMIT) {
  const data = await readJson(FEED).catch(() => null);
  const lines = Array.isArray(data?.lines) ? data.lines : [];
  return lines
    .filter((l) => l && typeof l.msg === "string")
    .slice(0, limit)
    .map(({ id, msg, at }) => ({ id, msg, at }));
}

async function rebuildApproved() {
  const { entries } = await readGuestbook();
  const lines = entries.filter((e) => e.status === "approved").slice(0, PUBLIC_LIMIT).map(({ id, msg, at }) => ({ id, msg, at }));
  await writeJson(FEED, { lines, builtAt: new Date().toISOString() });
}

// Find a line by visitor + id whatever folder it is in.
async function locate(who, id) {
  for (const st of STATUSES) {
    const p = entryPath(st, who, id);
    const e = normalizeEntry(await readJson(p).catch(() => null));
    if (e) return { p, e: { ...e, status: st } };
  }
  return null;
}

// Moving between folders is write-then-delete; a crash in between leaves a
// duplicate the admin can delete, never a lost line.
export async function setGuestStatus(who, id, status) {
  if (!safeWho(who) || !safeId(id)) return;
  const found = await locate(who, id);
  if (!found) return;
  const next = status === "approved" ? "approved" : "pending";
  if (found.e.status !== next) {
    await writeJson(entryPath(next, who, id), { ...found.e, status: next });
    await removeJson(found.p);
  }
  await rebuildApproved();
}

export async function deleteGuestLine(who, id) {
  if (!safeWho(who) || !safeId(id)) return;
  const found = await locate(who, id);
  if (found) await removeJson(found.p);
  await rebuildApproved();
}
