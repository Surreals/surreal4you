"use client";

import { useEffect, useState } from "react";

const pad = (n) => String(n).padStart(2, "0");

// Live recorder-style timecode in the top status line.
const StatusLine = () => {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-concrete">
      <span className="flex items-center gap-2">
        <span className="size-1.5 animate-pulse bg-signal" aria-hidden="true" />
        srrl
      </span>
      <span className="flex items-center gap-2">
        <span className="tabular-nums text-cold/80">{clock || "--:--:--"}</span>
        <span>· uzh</span>
      </span>
    </div>
  );
};

export default StatusLine;
