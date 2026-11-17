"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const Close = () => (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" aria-hidden="true">
    <path d="M4 4 12 12M12 4 4 12" />
  </svg>
);

const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

const clamp = (v, max) => Math.min(Math.max(0, v), Math.max(0, max));
// Past an edge the window follows less the further it is pulled (the iOS
// rubber band), so the edge reads as "nothing further", not as a wall.
const rubber = (over, dim) => (over * dim * 0.55) / (dim + 0.55 * over);
const band = (v, max, dim) => (v < 0 ? -rubber(-v, dim) : v > max ? max + rubber(v - max, dim) : v);

// A station window. Draggable by its title bar on desktop, a full-screen sheet
// below that. While held it follows the pointer through its own transform (no
// re-render, no easing); CSS variables hold where it rests.
const Window = ({ id, title, width, x, y, focused, closing, quick, origin, onFocus, onClose, onMove, children }) => {
  const ref = useRef(null);
  const drag = useRef(null);

  // Take focus on open so Esc and the close button are reachable at once —
  // unless the content already claimed it (the terminal focuses its input;
  // child effects run first) or the visitor is typing somewhere, e.g. in the
  // terminal that just opened this window.
  useEffect(() => {
    const el = ref.current;
    const active = document.activeElement;
    const typing = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA");
    if (el && !el.contains(active) && !typing) el.focus({ preventScroll: true });
  }, []);

  // The window grows out of its thing on the block and shrinks back into it:
  // aim the scale at that spot when it opens and again when it closes (it may
  // have been dragged since). Windows without a spot scale from their centre.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!origin || !isDesktop()) return;
    const from = origin.getBoundingClientRect();
    const layer = el.parentElement.getBoundingClientRect();
    el.style.transformOrigin = `${from.left + from.width / 2 - layer.left - x}px ${from.top + from.height / 2 - layer.top - y}px`;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- x / y are read at open and close only
  }, [closing, origin]);

  const onPointerDown = (e) => {
    if (!isDesktop() || e.button !== 0 || drag.current) return;
    if (e.target.closest("button")) return;
    const el = ref.current;
    const bounds = el.parentElement.getBoundingClientRect();
    // start from where the window is on screen, which is not x / y while it is still settling
    const live = new DOMMatrix(getComputedStyle(el).transform);
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      x: live.m41,
      y: live.m42,
      maxX: bounds.width - el.offsetWidth,
      maxY: bounds.height - el.offsetHeight,
      w: bounds.width,
      h: bounds.height,
      last: { x, y },
    };
    el.dataset.dragging = "true";
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const nx = d.x + e.clientX - d.startX;
    const ny = d.y + e.clientY - d.startY;
    d.last = { x: clamp(nx, d.maxX), y: clamp(ny, d.maxY) };
    ref.current.style.transform = `translate3d(${band(nx, Math.max(0, d.maxX), d.w)}px, ${band(ny, Math.max(0, d.maxY), d.h)}px, 0)`;
  };

  // Let go: the variables take the resting place and the CSS transition
  // carries the window back from wherever it was pulled past the edge.
  const onPointerUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const el = ref.current;
    el.style.setProperty("--x", `${d.last.x}px`);
    el.style.setProperty("--y", `${d.last.y}px`);
    el.style.transform = "";
    delete el.dataset.dragging;
    onMove(id, d.last);
  };

  return (
    <section
      ref={ref}
      role="dialog"
      aria-labelledby={`win-${id}-title`}
      tabIndex={-1}
      className="window pointer-events-auto outline-none"
      data-focused={focused}
      data-closing={closing}
      data-quick={quick}
      style={{ "--w": `${width}px`, "--x": `${x}px`, "--y": `${y}px`, zIndex: focused ? 20 : 10 }}
      onPointerDownCapture={() => onFocus(id)}
    >
      <header
        className="window-bar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <span id={`win-${id}-title`} className="text-ink">
          {title}
        </span>
        <button type="button" className="window-close" onClick={() => onClose(id)} aria-label="close">
          <Close />
        </button>
      </header>
      <div className="window-body">{children}</div>
    </section>
  );
};

export default Window;
