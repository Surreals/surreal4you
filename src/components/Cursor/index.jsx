"use client";

import { useEffect, useRef } from "react";

// Forensic crosshair cursor. Desktop / fine-pointer only; respects reduced motion.
const Cursor = () => {
  const ref = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const el = ref.current;
    const root = document.documentElement;
    root.classList.add("custom-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const interactive = e.target.closest("a, button, [role='button']");
      el.dataset.active = interactive ? "true" : "false";
    };
    const onLeave = () => (el.style.opacity = "0");
    const onEnter = () => (el.style.opacity = "1");

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    loop();

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
      root.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="reticle pointer-events-none fixed left-0 top-0 z-[1000] hidden"
    >
      <span className="reticle-box" />
      <span className="reticle-dot" />
    </div>
  );
};

export default Cursor;
