"use client";

import { useState } from "react";
import SpotifyEmbed from "../SpotifyEmbed";

// Fixed bottom bar. The play toggle expands a Spotify panel above it.
const MusicPlayer = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-11 z-40 px-3 transition-[opacity,transform] duration-300 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-2xl border border-line bg-asphalt">
          <SpotifyEmbed height={152} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-asphalt/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] text-concrete">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "close player" : "play"}
            aria-expanded={open}
            className="flex size-7 shrink-0 items-center justify-center border border-line text-cold transition-colors hover:border-signal hover:bg-signal"
          >
            <span aria-hidden="true">{open ? "✕" : "▶"}</span>
          </button>
          <span className="text-cold">Srrl</span>
          <span className="truncate">lalala</span>
          <span className="ml-auto hidden text-concrete sm:inline">spotify</span>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
