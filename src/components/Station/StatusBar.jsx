import { HQ } from "../../lib/feeds";

const Sun = () => (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5 13 13M3 13l1.5-1.5M11.5 4.5 13 3" />
  </svg>
);

const Moon = () => (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M13 10.5A6 6 0 0 1 5.5 3a6 6 0 1 0 7.5 7.5Z" />
  </svg>
);

// Top status line: rec, Uzhhorod time, coordinates, and the station controls.
const StatusBar = ({ clock, signal, theme, onRec, onToggleTheme, onOpen, open }) => {
  const isDay = theme === "day";
  return (
    <div className="status">
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

      <span className="ml-auto flex items-center gap-1">
        <button
          type="button"
          className="ctl"
          onClick={() => onOpen("log")}
          data-active={open.includes("log")}
          aria-pressed={open.includes("log")}
        >
          log
        </button>
        <button
          type="button"
          className="ctl"
          onClick={() => onOpen("map")}
          data-active={open.includes("map")}
          aria-pressed={open.includes("map")}
        >
          map
        </button>
        <button
          type="button"
          className="ctl"
          onClick={onToggleTheme}
          aria-label={isDay ? "switch to night" : "switch to day"}
          title={isDay ? "night" : "day"}
        >
          {isDay ? <Moon /> : <Sun />}
          <span className="hidden sm:inline">{isDay ? "night" : "day"}</span>
        </button>
      </span>
    </div>
  );
};

export default StatusBar;
