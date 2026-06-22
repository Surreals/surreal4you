import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import { list, put } from "@vercel/blob";
import { mainLinks, sideLinks, album as defaultAlbum } from "../utils/constants";
import { products as defaultProducts } from "../data/products";

const CONTENT_PATH = "content/site.json";
const LOCAL_FILE = path.join(process.cwd(), ".data", "content.json");

const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// Seed content: the current static data, used until an admin saves changes.
export const DEFAULT_CONTENT = {
  products: defaultProducts,
  album: defaultAlbum,
  links: { main: mainLinks, side: sideLinks },
};

// Coerce arbitrary stored JSON into the shape the UI expects.
function normalize(raw) {
  const c = raw && typeof raw === "object" ? raw : {};
  return {
    products: Array.isArray(c.products) ? c.products : DEFAULT_CONTENT.products,
    album: { ...DEFAULT_CONTENT.album, ...(c.album && typeof c.album === "object" ? c.album : {}) },
    links: {
      main: Array.isArray(c.links?.main) ? c.links.main : DEFAULT_CONTENT.links.main,
      side: Array.isArray(c.links?.side) ? c.links.side : DEFAULT_CONTENT.links.side,
    },
  };
}

// Deduped per request so multiple components share one read.
export const getContent = cache(async () => {
  try {
    if (hasBlob()) {
      const { blobs } = await list({ prefix: CONTENT_PATH });
      const found = blobs.find((b) => b.pathname === CONTENT_PATH);
      if (found) {
        const res = await fetch(found.url, { cache: "no-store" });
        if (res.ok) return normalize(await res.json());
      }
    } else {
      const raw = await fs.readFile(LOCAL_FILE, "utf8").catch(() => null);
      if (raw) return normalize(JSON.parse(raw));
    }
  } catch {
    // Any read/parse failure falls back to the seed defaults below.
  }
  return DEFAULT_CONTENT;
});

export async function saveContent(content) {
  const normalized = normalize(content);
  const body = JSON.stringify(normalized, null, 2);
  if (hasBlob()) {
    await put(CONTENT_PATH, body, {
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
  return normalized;
}

/**
 * Upload a File (from FormData) to Vercel Blob and return its public URL.
 * Returns null when there is no file or Blob is not configured (the caller
 * then keeps the manually-entered image path instead).
 */
export async function uploadImage(file) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) return null;
  if (!hasBlob()) return null;
  const safeName = (file.name || "upload").replace(/[^a-zA-Z0-9._-]/g, "_");
  const { url } = await put(`uploads/${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return url;
}
