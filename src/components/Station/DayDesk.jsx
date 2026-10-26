import { DESK, HQ } from "../../lib/feeds";

// A folder, drawn on an 8-unit grid so it keeps its pixel edge at any size.
const Folder = ({ accent }) => (
  <svg viewBox="0 0 64 48" className="folder-icon" aria-hidden="true" shapeRendering="crispEdges">
    <path d="M2 6h22l6 6h32v34H2z" fill={accent ? "var(--red)" : "var(--panel-2)"} stroke="var(--ink)" strokeWidth="2" />
    <path d="M2 18h60" stroke="var(--ink)" strokeWidth="2" />
    <path d="M6 10h14" stroke={accent ? "#fff" : "var(--ink)"} strokeWidth="2" opacity=".5" />
  </svg>
);

const File = () => (
  <svg viewBox="0 0 48 64" className="folder-icon" aria-hidden="true" shapeRendering="crispEdges">
    <path d="M4 2h28l12 12v48H4z" fill="var(--panel-2)" stroke="var(--ink)" strokeWidth="2" />
    <path d="M32 2v12h12" fill="none" stroke="var(--ink)" strokeWidth="2" />
    <path d="M12 26h24M12 34h24M12 42h16" stroke="var(--ink)" strokeWidth="2" />
  </svg>
);

// The day site: concrete, one desk, folders. Nothing moves; the cameras are
// asleep. Same windows, same keyboard, same log underneath. Three pieces so
// the station can slot them into its grid rows next to the night chrome.
export const DayHead = ({ clock, onToggleTheme }) => (
  <header className="day-only dayhead">
    <span className="font-sign text-2xl text-ink">Srrlovych</span>
    <span className="hidden sm:inline">
      {HQ.city} · <span className="tnum">{clock.time}</span>
    </span>
    <button type="button" className="ctl ml-auto" onClick={onToggleTheme}>
      night
    </button>
  </header>
);

export const Desk = ({ note, open, onOpen }) => (
  <div className="day-only desk" aria-label="desk">
    {DESK.map((f) => (
      <button
        key={f.id}
        type="button"
        className="folder"
        style={{ "--fx": `${f.x}%`, "--fy": `${f.y}%` }}
        onClick={() => onOpen(f.id)}
        aria-pressed={open.includes(f.id)}
        data-open={open.includes(f.id)}
      >
        {f.id === "terminal" ? <File /> : <Folder accent={f.accent} />}
        <span className="folder-label">{f.label ?? note.title}</span>
      </button>
    ))}
  </div>
);

export const DayFoot = ({ links, attribution }) => (
  <footer className="day-only dayfoot">
    <nav aria-label="links" className="flex flex-wrap items-center">
      {[...links.main, ...links.side].map((l, i) => (
        <span key={l.name} className="flex items-center">
          {i ? <span className="px-2 text-dim">/</span> : null}
          <a
            href={l.url}
            target={l.url.startsWith("/") ? undefined : "_blank"}
            rel={l.url.startsWith("/") ? undefined : "noopener noreferrer"}
            className="ctl -mx-2"
          >
            {l.name.toLowerCase()}
          </a>
        </span>
      ))}
    </nav>
    <span className="ml-auto text-[11px] text-dim">{attribution}</span>
  </footer>
);
