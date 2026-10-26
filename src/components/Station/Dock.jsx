import Link from "next/link";

const Play = () => (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
    <path d="M5.5 4 12.5 8 5.5 12Z" />
  </svg>
);

const DockLink = ({ link }) => {
  const label = link.name.toLowerCase();
  if (link.internal || link.url?.startsWith("/")) {
    return (
      <Link href={link.url} className="ctl">
        {label}
      </Link>
    );
  }
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className="ctl">
      {label}
    </a>
  );
};

// Bottom dock: the player (opens the music window) and every channel the
// artist is on. Sticky on mobile so the player is always one tap away.
const Dock = ({ album, links, onOpen, musicOpen, attribution, className = "" }) => {
  return (
    <div className={`dock ${className}`}>
      <button
        type="button"
        className="ctl"
        onClick={() => onOpen("music")}
        aria-pressed={musicOpen}
        aria-label={`${musicOpen ? "close" : "open"} player`}
      >
        <Play />
        <span className="text-ink">srrlovych</span>
        <span className="hidden text-dim sm:inline">
          — {album.title} · {(album.status ?? "").toLowerCase()}
        </span>
      </button>

      <nav aria-label="links" className="flex flex-wrap items-center gap-0 sm:ml-auto">
        {[...links.main, ...links.side].map((l) => (
          <DockLink key={l.name} link={l} />
        ))}
      </nav>

      {attribution ? <span className="hidden w-full justify-end text-[11px] lg:flex">{attribution}</span> : null}
    </div>
  );
};

export default Dock;
