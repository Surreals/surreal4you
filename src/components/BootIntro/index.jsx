"use client";

import { useEffect, useState } from "react";

// Brief boot sweep on first load of the session. Skipped on reduced motion.
const BootIntro = () => {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("srrl-boot")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem("srrl-boot", "1");
      return;
    }
    // Hold the page entrance while the overlay is up, then release it so the
    // content rises through the fade instead of behind it — see globals.css.
    const root = document.documentElement;
    const release = () => delete root.dataset.boot;
    root.dataset.boot = "1";

    setShow(true);
    const t1 = setTimeout(() => {
      setClosing(true);
      release();
    }, 1100);
    const t2 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("srrl-boot", "1");
    }, 1650);
    return () => {
      release();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center gap-4 bg-bark transition-opacity duration-500 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <span className="boot-scan pointer-events-none absolute inset-x-0 h-px bg-leaf/70" />
      <span className="font-display text-5xl leading-none text-bone md:text-7xl">Srrlovych</span>
      <span className="font-mono text-[10px] tracking-[0.4em] text-lichen">
        uzh · 48.62n 22.29e
      </span>
    </div>
  );
};

export default BootIntro;
