import { promises as fs } from "fs";
import path from "path";
import { createHash, randomUUID } from "crypto";
import { list, put } from "@vercel/blob";

// Visitor lines for the station log. Everything lands as `pending`; only
// `approved` lines reach the public feed. Stored next to the site content:
// one JSON blob (or a local file in dev).
const BOOK_PATH = "content/guestbook.json";
const LOCAL_FILE = path.join(process.cwd(), ".data", "guestbook.json");

export const MAX_LEN = 80;
export const MIN_LEN = 2;
export const MAX_PENDING = 300;

const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const normalize = (raw) => {
  const entries = Array.isArray(raw?.entries) ? raw.entries : [];
  return {
    entries: entries
      .filter((e) => e && typeof e.id === "string" && typeof e.msg === "string")
      .map((e) => ({
        id: e.id,
        msg: e.msg,
        at: typeof e.at === "string" ? e.at : new Date(0).toISOString(),
        who: typeof e.who === "string" ? e.who : "",
        status: e.status === "approved" ? "approved" : "pending",
      })),
  };
};

export async function readGuestbook() {
  try {
    if (hasBlob()) {
      const { blobs } = await list({ prefix: BOOK_PATH });
      const found = blobs.find((b) => b.pathname === BOOK_PATH);
      if (found) {
        const res = await fetch(found.url, { cache: "no-store" });
        if (res.ok) return normalize(await res.json());
      }
    } else {
      const raw = await fs.readFile(LOCAL_FILE, "utf8").catch(() => null);
      if (raw) return normalize(JSON.parse(raw));
    }
  } catch {
    // fall through to an empty book
  }
  return { entries: [] };
}

async function writeGuestbook(book) {
  const body = JSON.stringify(normalize(book), null, 2);
  if (hasBlob()) {
    await put(BOOK_PATH, body, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
  } else {
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, body, "utf8");
  }
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
// admin, never the address itself.
export function visitorHash(ip) {
  return createHash("sha256")
    .update(`${process.env.AUTH_SECRET ?? "srrl"}:${ip ?? ""}`)
    .digest("hex")
    .slice(0, 8);
}

export async function addGuestLine(msg, who) {
  const book = await readGuestbook();
  const pending = book.entries.filter((e) => e.status === "pending").length;
  if (pending >= MAX_PENDING) return null;
  const entry = { id: randomUUID(), msg, at: new Date().toISOString(), who, status: "pending" };
  book.entries.unshift(entry);
  await writeGuestbook(book);
  return entry;
}

export async function approvedLines(limit = 40) {
  const book = await readGuestbook();
  return book.entries
    .filter((e) => e.status === "approved")
    .slice(0, limit)
    .map(({ id, msg, at }) => ({ id, msg, at }));
}

export async function setGuestStatus(id, status) {
  const book = await readGuestbook();
  const e = book.entries.find((x) => x.id === id);
  if (!e) return;
  e.status = status === "approved" ? "approved" : "pending";
  await writeGuestbook(book);
}

export async function deleteGuestLine(id) {
  const book = await readGuestbook();
  book.entries = book.entries.filter((x) => x.id !== id);
  await writeGuestbook(book);
}
