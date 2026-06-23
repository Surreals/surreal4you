"use client";

import { useEffect, useRef } from "react";

// Full-bleed "Srrl" signature watermark (handwritten Rock Salt) that drifts
// subtly with the cursor for depth. Static on touch / reduced motion.
const Title = () => {
  const ref = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const el = ref.current;
    let raf = 0;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <h1 className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center">
      <span
        ref={ref}
        className="font-display text-7xl leading-none text-cold/[0.07] transition-transform duration-300 ease-out sm:text-8xl md:text-9xl"
      >
        Srrl
      </span>
    </h1>
  );
};

export default Title;
