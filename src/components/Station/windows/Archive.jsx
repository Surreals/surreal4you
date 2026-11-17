"use client";

import { useState } from "react";
import Image from "next/image";
import { PLATES } from "../../../lib/feeds";

// The garage: evidence plates. Click a plate to pull it up; the grid stays behind.
const Archive = () => {
  const [active, setActive] = useState(null);
  const [origin, setOrigin] = useState("50% 50%");
  const plate = active === null ? null : PLATES[active];

  if (plate) {
    return (
      <div key="view" className="plate-view p-4 sm:p-5" style={{ transformOrigin: origin }}>
        <div className="mb-3 flex items-center justify-between text-dim">
          <span>
            {String(active + 1).padStart(2, "0")} / {String(PLATES.length).padStart(2, "0")} · {plate.tag}
          </span>
          <button type="button" className="ctl -mr-2" onClick={() => setActive(null)}>
            back
          </button>
        </div>
        <div className="plate">
          <Image
            src={plate.src}
            alt={plate.tag}
            width={plate.w}
            height={plate.h}
            sizes="(min-width: 1024px) 780px, 100vw"
            className="h-auto max-h-[70dvh] w-full object-contain"
            style={{ filter: "none" }}
          />
        </div>
        <div className="mt-3 flex justify-between">
          <button
            type="button"
            className="ctl -ml-2"
            onClick={() => setActive((active - 1 + PLATES.length) % PLATES.length)}
          >
            ← prev
          </button>
          <button type="button" className="ctl -mr-2" onClick={() => setActive((active + 1) % PLATES.length)}>
            next →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div key="grid" className="grid grid-cols-2 gap-px bg-line p-px sm:grid-cols-3 md:grid-cols-4">
      {PLATES.map((p, i) => (
        <button
          key={p.src}
          type="button"
          className="plate aspect-square border-0"
          onClick={(e) => {
            // the plate view scales up from this tile (.plate-view in globals.css)
            const tile = e.currentTarget.getBoundingClientRect();
            const body = e.currentTarget.closest(".window-body").getBoundingClientRect();
            setOrigin(`${tile.left + tile.width / 2 - body.left}px ${tile.top + tile.height / 2 - body.top}px`);
            setActive(i);
          }}
          aria-label={`open: ${p.tag}`}
        >
          <Image src={p.src} alt="" fill sizes="(min-width: 1024px) 200px, 50vw" className="object-cover" />
          <span className="plate-tag">{p.tag}</span>
        </button>
      ))}
    </div>
  );
};

export default Archive;
