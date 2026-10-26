import { NextResponse } from "next/server";
import { addGuestLine, approvedLines, cleanLine, visitorHash } from "@/lib/guestbook";

export const dynamic = "force-dynamic";

// One line per visitor per minute, per server instance. Good enough to stop
// a held-down enter key; the admin queue is the real filter.
const recent = new Map();
const WINDOW_MS = 60_000;

const ipOf = (req) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";

export async function GET() {
  const lines = await approvedLines(40);
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

  const ip = ipOf(req);
  const now = Date.now();
  const last = recent.get(ip) ?? 0;
  if (now - last < WINDOW_MS) return NextResponse.json({ error: "too fast" }, { status: 429 });
  recent.set(ip, now);
  if (recent.size > 5000) recent.clear();

  const entry = await addGuestLine(msg, visitorHash(ip));
  if (!entry) return NextResponse.json({ error: "queue full" }, { status: 503 });
  return NextResponse.json({ ok: true, pending: true, msg });
}
