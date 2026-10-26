import { HQ } from "../../lib/feeds";

const Sun = () => (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5 13 13M3 13l1.5-1.5M11.5 4.5 13 3" />
  </svg>
);

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

// Top status line of the night station: rec, Uzhhorod time, coordinates,
// and the tools. The day desk has its own, quieter header.
const StatusBar = ({ clock, signal, onRec, onToggleTheme, onOpen, open, noteIsNew }) => {
  return (
    <div className="status night-only">
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
      <span className="hidden sm:inline">{clock.date}</span>
      <span className="hidden md:inline">
        {HQ.city} · {HQ.lat} {HQ.lon}
      </span>

      <span className="ml-auto flex items-center gap-0.5">
        <Tool id="note" label="note" open={open} onOpen={onOpen} badge={noteIsNew} />
        <Tool id="log" label="log" open={open} onOpen={onOpen} />
        <Tool id="map" label="map" open={open} onOpen={onOpen} />
        <Tool id="terminal" label=">_" open={open} onOpen={onOpen} />
        <button type="button" className="ctl" onClick={onToggleTheme} aria-label="switch to day" title="day">
          <Sun />
          <span className="hidden sm:inline">day</span>
        </button>
      </span>
    </div>
  );
};

export default StatusBar;
