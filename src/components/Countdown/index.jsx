"use client";

import { useEffect, useState } from "react";
import { NOTIFY_URL } from "../../utils/constants";

// Release: 03.07 (Kyiv time).
const TARGET = new Date("2026-07-03T00:00:00+03:00").getTime();
const pad = (n) => String(n).padStart(2, "0");

const getLeft = () => {
  const ms = TARGET - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
};

const Countdown = ({ title }) => {
  const [t, setT] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setT(getLeft());
    const id = setInterval(() => setT(getLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rise relative z-10 flex flex-col items-center gap-2 place-self-center [animation-delay:120ms]">
      <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-concrete">
        <span className="size-1.5 animate-pulse bg-signal" aria-hidden="true" />
        next
      </span>
      {mounted && t ? (
        <span className="font-mono text-4xl font-bold tabular-nums tracking-[0.04em] text-cold md:text-6xl">
          {pad(t.d)}<span className="text-concrete">:</span>{pad(t.h)}
          <span className="text-concrete">:</span>{pad(t.m)}
          <span className="text-concrete">:</span>{pad(t.s)}
        </span>
      ) : (
        <span className="font-mono text-4xl font-bold tabular-nums tracking-[0.05em] text-cold md:text-6xl">
          03.07
        </span>
      )}
      <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-concrete">
        03.07 — {title}
      </span>
      <a
        href={NOTIFY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-3 inline-flex items-center gap-2 border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cold transition-colors hover:border-signal hover:bg-signal"
      >
        <span className="size-1.5 animate-pulse bg-signal group-hover:bg-cold" aria-hidden="true" />
        notify me
      </a>
    </div>
  );
};

export default Countdown;
