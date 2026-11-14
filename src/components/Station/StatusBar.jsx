import { HQ } from "../../lib/feeds";

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

// The one line above the block: the name, rec, Uzhhorod time and the tools.
const StatusBar = ({ clock, signal, theme, onRec, onToggleTheme, onOpen, open, noteIsNew }) => {
  const next = theme === "day" ? "night" : "day";
  return (
    <div className="status">
      <span className="font-display text-base font-black leading-none tracking-tight text-ink">SRRLOVYCH</span>
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
