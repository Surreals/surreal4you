import { NextResponse } from "next/server";
import { addGuestLine, approvedLines, cleanLine, visitorHash } from "@/lib/guestbook";

export const dynamic = "force-dynamic";

// Two layers against a held-down enter key: a per-instance minute window on
// the client address (cheap, best effort — instances do not share it), and
// the store's own caps per visitor hash and in total (see lib/guestbook).
const recent = new Map();
const WINDOW_MS = 60_000;

// Only headers the platform sets on the way in. x-forwarded-for is never
// read: its first hop is whatever the client sends. Off Vercel (local dev,
// another host without these headers) every visitor shares one identity and
// one set of caps — safe, just strict.
const ipOf = (req) =>
  req.headers.get("x-real-ip") || req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown";

const sweep = (now) => {
  for (const [k, t] of recent) if (now - t > WINDOW_MS) recent.delete(k);
};

export async function GET() {
  const lines = await approvedLines();
  return NextResponse.json({ lines }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const msg = cleanLine(body?.msg);
  if (!msg) return NextResponse.json({ error: "line rejected" }, { status: 422 });

  const who = visitorHash(ipOf(req));
  const now = Date.now();
  if (recent.size > 2000) sweep(now);
  const last = recent.get(who) ?? 0;
  if (now - last < WINDOW_MS) return NextResponse.json({ error: "too fast" }, { status: 429 });
  recent.set(who, now);

  const result = await addGuestLine(msg, who);
  if (typeof result === "string") {
    const status = result === "visitor cap" ? 429 : 503;
    return NextResponse.json({ error: result }, { status });
  }
  return NextResponse.json({ ok: true, pending: true, msg });
}
