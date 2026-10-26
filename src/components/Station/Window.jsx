"use client";

import { useEffect, useRef } from "react";

const Close = () => (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" aria-hidden="true">
    <path d="M4 4 12 12M12 4 4 12" />
  </svg>
);

const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

// A station window. Draggable by its title bar on desktop, a full-screen sheet
// below that. Position lives in CSS variables so the drag never re-renders.
const Window = ({ id, title, width, x, y, focused, closing, onFocus, onClose, onMove, children }) => {
  const ref = useRef(null);
  const drag = useRef(null);

  // Take focus on open so Esc and the close button are reachable at once.
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  const onPointerDown = (e) => {
    if (!isDesktop() || e.button !== 0) return;
    if (e.target.closest("button")) return;
    const el = ref.current;
    const bounds = el.parentElement.getBoundingClientRect();
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      x,
      y,
      maxX: bounds.width - el.offsetWidth,
      maxY: bounds.height - el.offsetHeight,
      last: { x, y },
    };
    el.dataset.dragging = "true";
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const nx = Math.min(Math.max(0, d.x + e.clientX - d.startX), Math.max(0, d.maxX));
    const ny = Math.min(Math.max(0, d.y + e.clientY - d.startY), Math.max(0, d.maxY));
    d.last = { x: nx, y: ny };
    ref.current.style.setProperty("--x", `${nx}px`);
    ref.current.style.setProperty("--y", `${ny}px`);
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    delete ref.current.dataset.dragging;
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
