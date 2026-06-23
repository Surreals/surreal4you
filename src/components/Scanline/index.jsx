"use client";

import { useEffect, useState } from "react";

// A faint x-ray line sweeping the viewport — surveillance-monitor feel.
const Scanline = () => {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!on) return null;

  return (
    <div
      aria-hidden="true"
      className="scanline pointer-events-none fixed inset-x-0 top-0 z-[60] h-px bg-xray/20"
    />
  );
};

export default Scanline;
