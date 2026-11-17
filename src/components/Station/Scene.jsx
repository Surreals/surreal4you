"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SPOTS } from "../../lib/feeds";
import { SCENE_H, SCENE_W, THINGS } from "../../lib/walk";
import Walker from "./Walker";

const ALT =
  "A block of Uzhhorod cut out like a model: stadium stands, a shuttered kiosk, a garage with a black sedan, a guard booth, a street lamp, a notice board and a radio mast";

// The camera loop plays while the pointer, focus or the walker rests on its
// spot, unless the visitor asked for less motion or less data.
const play = (spot) => {
  const v = spot?.querySelector("video");
  if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches || navigator.connection?.saveData) return;
  if (!v.getAttribute("src")) v.setAttribute("src", v.dataset.src);
  v.play().catch(() => {});
};
const pause = (spot) => spot?.querySelector("video")?.pause();

// Each thing on the block cut out of the same picture by its outline. Walker
// shows the cut-out over himself while he stands behind that thing.
const clip = (shape) => `polygon(${shape.map(([x, y]) => `${(x / SCENE_W) * 100}% ${(y / SCENE_H) * 100}%`).join(", ")})`;
const SIZES = "(min-width: 1024px) 100vw, 150vh";

// The block. One picture per theme, seven spots on it; each spot opens a
// window, and the four with a camera show what that camera sees on hover or
// while the walker stands at it.
const Scene = ({ album, note, open, signal, merchOffline, onOpen, spotRefs }) => {
  const wrapRef = useRef(null);
  const sceneRef = useRef(null);
  const [near, setNear] = useState(null);

  // Narrow screens pan the block sideways; start in the middle of it.
  useEffect(() => {
    const el = wrapRef.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    // The other theme's picture is fetched once the page has settled, so the
    // day / night switch can crossfade into it instead of waiting for it.
    const warm = setTimeout(() => {
      if (navigator.connection?.saveData) return;
      sceneRef.current?.querySelectorAll(':scope > img[loading="lazy"]').forEach((img) => (img.loading = "eager"));
    }, 3000);
    return () => clearTimeout(warm);
  }, []);

  useEffect(() => {
    const el = near && spotRefs.current[near];
    play(el);
    return () => pause(el);
  }, [near, spotRefs]);

  return (
    <div ref={wrapRef} className="scene-wrap rise">
      <div ref={sceneRef} className="scene" data-signal={signal}>
        {/* shortcut: only the night picture is preloaded, a day-time visit fetches its picture late; split by theme cookie if LCP matters */}
        <Image src="/scene/night.webp" alt={ALT} fill priority sizes={SIZES} className="scene-img night-only" />
        <Image src="/scene/day.webp" alt={ALT} fill sizes={SIZES} className="scene-img day-only" />
        <span className="beacon night-only" aria-hidden="true" />
        <span className="scene-static" aria-hidden="true" />
        {THINGS.map((t) => (
          <div key={t.id} className="occluder" data-thing={t.id} style={{ clipPath: clip(t.shape) }} aria-hidden="true">
            <Image src="/scene/night.webp" alt="" fill sizes={SIZES} className="scene-img night-only" />
            <Image src="/scene/day.webp" alt="" fill sizes={SIZES} className="scene-img day-only" />
          </div>
        ))}
        <Walker sceneRef={sceneRef} wrapRef={wrapRef} spots={SPOTS} onOpen={onOpen} onNear={setNear} />

        {SPOTS.map((s, i) => {
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
              style={{ left: `${s.x}%`, top: `${s.y}%`, "--ping": `${-((i * 0.9) % 2.4).toFixed(1)}s` }}
              data-open={isOpen}
              data-near={near === s.id || undefined}
              data-below={s.y < 40 || undefined}
              onClick={() => onOpen(s.id)}
              onPointerEnter={(e) => play(e.currentTarget)}
              onPointerLeave={(e) => near !== s.id && pause(e.currentTarget)}
              onFocus={(e) => play(e.currentTarget)}
              onBlur={(e) => near !== s.id && pause(e.currentTarget)}
              aria-label={`${s.place} — ${what}: open`}
              aria-expanded={isOpen}
              aria-haspopup="dialog"
              aria-keyshortcuts={s.key}
            >
              <span className="spot-dot" aria-hidden="true" />
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
