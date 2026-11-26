"use client";

import { useEffect, useState } from "react";
import { useClock } from "@/components/Station/useClock";
import { HQ } from "@/lib/feeds";

// The station's heartbeat in the admin header: rec, Uzhhorod time and one of
// the log's own lines typing itself out every few seconds.
const Pulse = ({ lines }) => {
  const clock = useClock(HQ.tz);
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1 + Math.floor(Math.random() * 5)) % lines.length), 7000);
    return () => clearInterval(id);
  }, [lines.length]);

  const line = lines[i] ?? "";
  return (
    <div className="adm-pulse" aria-hidden="true">
      <span className="adm-rec" />
      <span className="tabular-nums text-ink">{clock.time}</span>
      <span key={i} className="adm-type" style={{ "--n": line.length }}>
        {line}
      </span>
    </div>
  );
};

export default Pulse;
