"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { SPOTS } from "../../lib/feeds";

const ALT =
  "A block of Uzhhorod cut out like a model: stadium stands, a shuttered kiosk, a garage with a black sedan, a guard booth, a man under a street lamp, a notice board and a radio mast";

// The camera loop plays while the pointer or focus rests on its spot, unless
// the visitor asked for less motion or less data.
const play = (e) => {
  const v = e.currentTarget.querySelector("video");
  if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches || navigator.connection?.saveData) return;
  if (!v.getAttribute("src")) v.setAttribute("src", v.dataset.src);
  v.play().catch(() => {});
};
const pause = (e) => e.currentTarget.querySelector("video")?.pause();

// The block. One picture per theme, seven spots on it; each spot opens a
// window, and the four with a camera show what that camera sees on hover.
const Scene = ({ album, note, open, signal, merchOffline, onOpen, spotRefs }) => {
  const wrapRef = useRef(null);

  // Narrow screens pan the block sideways; start in the middle of it.
  useEffect(() => {
    const el = wrapRef.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  return (
    <div ref={wrapRef} className="scene-wrap rise">
      <div className="scene" data-signal={signal}>
        {/* shortcut: only the night picture is preloaded, a day-time visit fetches its picture late; split by theme cookie if LCP matters */}
        <Image src="/scene/night.webp" alt={ALT} fill priority sizes="(min-width: 1024px) 100vw, 150vh" className="scene-img night-only" />
        <Image src="/scene/day.webp" alt={ALT} fill sizes="(min-width: 1024px) 100vw, 150vh" className="scene-img day-only" />
        <span className="scene-static" aria-hidden="true" />

        {SPOTS.map((s) => {
          const offline = s.id === "merch" && merchOffline;
          const view = offline ? { ...s, ...s.offline } : s;
          const isOpen = open.includes(s.id);
          const what = s.id === "music" ? album.title : s.id === "note" ? note.title : s.label;
          return (
            <button
              key={s.id}
              ref={(el) => {
                spotRefs.current[s.id] = el;
                if (el) el.dataset.win = s.id;
              }}
              type="button"
              className="spot"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              data-open={isOpen}
              data-below={s.y < 40 || undefined}
              onClick={() => onOpen(s.id)}
              onPointerEnter={play}
              onPointerLeave={pause}
              onFocus={play}
              onBlur={pause}
              aria-label={`${s.place} — ${what}: open`}
              aria-expanded={isOpen}
              aria-haspopup="dialog"
              aria-keyshortcuts={s.key}
            >
              <span className="spot-dot" aria-hidden="true" />
              <span className="spot-label" aria-hidden="true">
                {s.place}
              </span>
              <span className="spot-card" aria-hidden="true">
                {s.cam ? (
                  <span className="spot-cam">
                    <Image src={view.image} alt="" fill sizes="224px" className="object-cover" />
                    {view.clip ? (
                      <video
                        data-src={view.clip}
                        muted
                        loop
                        playsInline
                        preload="none"
                        tabIndex={-1}
                        onPlaying={(e) => (e.currentTarget.dataset.live = "1")}
                        onPause={(e) => delete e.currentTarget.dataset.live}
                      />
                    ) : null}
                    <span className="scan" />
                  </span>
                ) : null}
                <span className="spot-osd">
                  <span>{s.cam ? (offline ? `${s.cam} · ${view.scene}` : s.cam) : s.place}</span>
                  <span>{what}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Scene;
