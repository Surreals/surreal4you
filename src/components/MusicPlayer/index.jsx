"use client";

import { useState } from "react";
import SpotifyEmbed from "../SpotifyEmbed";

// Both icons stay mounted and cross-fade, so the swap animates in each
// direction without a motion dependency.
const iconLayer =
  "absolute inset-0 flex items-center justify-center transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]";
const iconIn = "scale-100 opacity-100 blur-0";
const iconOut = "scale-[0.25] opacity-0 blur-[4px]";

// 16-unit grid rendered at 14px keeps the effective stroke near 1.5px, matching
// the regular-weight mono labels beside it.
// The triangle's box sits 1px right of centre: a play mark centred geometrically
// always reads as pushed left.
const PlayIcon = () => (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
    <path d="M5.5 4 12.5 8 5.5 12Z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox="0 0 16 16"
    className="size-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="square"
    aria-hidden="true"
  >
    <path d="M4 4 12 12M12 4 4 12" />
  </svg>
);

// The visible toggle box stays 28px; the `after` pseudo carries the 44px touch
// target. Nothing else in the bar is interactive, so it cannot collide.
const toggle =
  "relative flex size-7 shrink-0 items-center justify-center border border-line text-bone transition-[color,background-color,border-color,transform] duration-200 ease-out after:absolute after:left-1/2 after:top-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] hover:border-leaf hover:bg-leaf hover:text-bark active:scale-[0.96]";

// Fixed bottom bar. The play toggle expands a Spotify panel above it.
const MusicPlayer = () => {
  const [open, setOpen] = useState(false);

  return (
    // One fixed shell so the panel sits directly above the bar in flow rather
    // than at a hand-measured offset. It ignores the pointer; the bar and the
    // open panel take it back.
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
      <div
        id="spotify-panel"
        className={`px-3 pb-2 transition-[opacity,transform,visibility] duration-300 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "invisible translate-y-3 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-2xl overflow-hidden border border-line bg-bark">
          <SpotifyEmbed height={152} />
        </div>
      </div>

      <div className="pointer-events-auto border-t border-line bg-bark/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] text-lichen">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "close player" : "play"}
            aria-expanded={open}
            aria-controls="spotify-panel"
            className={toggle}
          >
            <span className="relative size-3.5">
              <span className={`${iconLayer} ${open ? iconIn : iconOut}`}>
                <CloseIcon />
              </span>
              <span className={`${iconLayer} ${open ? iconOut : iconIn}`}>
                <PlayIcon />
              </span>
            </span>
          </button>
          <span className="text-bone">Srrl</span>
          <span className="truncate">lalala</span>
          <span className="ml-auto hidden text-lichen sm:inline">spotify</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
