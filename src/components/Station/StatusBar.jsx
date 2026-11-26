import { useRef } from "react";
import Image from "next/image";
import { HQ } from "../../lib/feeds";

const NAME = "SRRLOVYCH";
const KNOCK_MS = 3000;

const Tool = ({ id, label, open, onOpen, badge }) => (
  <button
    type="button"
    className="ctl"
    onClick={() => onOpen(id)}
    data-active={open.includes(id)}
    aria-pressed={open.includes(id)}
  >
    {label}
    {badge ? <span className="badge" aria-label="new" /> : null}
  </button>
);

// The one line above the block: the mask and the name, rec, Uzhhorod time and the tools.
const StatusBar = ({ clock, signal, theme, onRec, onToggleTheme, onOpen, open, noteIsNew }) => {
  const next = theme === "day" ? "night" : "day";
  const step = useRef(0);
  const last = useRef(0);

  // The way in: the mask, then every letter of the name in order, each within
  // KNOCK_MS of the last, opens the admin in a new window. A wrong click starts over.
  const knock = (i) => {
    const now = Date.now();
    if (now - last.current > KNOCK_MS) step.current = 0;
    last.current = now;
    step.current = i === step.current ? i + 1 : i === 0 ? 1 : 0;
    if (step.current > NAME.length) {
      step.current = 0;
      window.open("/adminka", "_blank");
    }
  };

  return (
    <div className="status">
      <span className="flex select-none items-center gap-2 font-display text-base font-black leading-none tracking-tight text-ink">
        <Image src="/brand/logo-64.png" alt="" width={22} height={22} onClick={() => knock(0)} />
        <span className="sr-only">{NAME}</span>
        <span aria-hidden="true">
          {[...NAME].map((ch, i) => (
            <span key={i} onClick={() => knock(i + 1)}>
              {ch}
            </span>
          ))}
        </span>
      </span>
      <button
        type="button"
        onClick={onRec}
        className="ctl"
        title="rec"
        aria-label={signal === "lost" ? "signal lost" : "recording — click to drop the signal"}
      >
        <span className="rec" aria-hidden="true" />
        <span>{signal === "lost" ? "no signal" : "rec"}</span>
      </button>

      <span className="tnum text-ink">{clock.time}</span>
      <span className="hidden md:inline">
        {HQ.city} · {HQ.lat} {HQ.lon}
      </span>

      <span className="ml-auto flex items-center gap-0.5">
        <Tool id="note" label="note" open={open} onOpen={onOpen} badge={noteIsNew} />
        <Tool id="log" label="log" open={open} onOpen={onOpen} />
        <Tool id="map" label="map" open={open} onOpen={onOpen} />
        <Tool id="terminal" label=">_" open={open} onOpen={onOpen} />
        <button type="button" className="ctl" onClick={onToggleTheme} aria-label={`switch to ${next}`}>
          {next}
        </button>
      </span>
    </div>
  );
};

export default StatusBar;
