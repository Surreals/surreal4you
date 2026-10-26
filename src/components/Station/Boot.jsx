"use client";

import { useEffect, useState } from "react";
import { BOOT_LINES } from "../../lib/feeds";

// Station boot on the first visit of a session: six lines in ~0.8s, then the
// cover fades and the feeds rise through it. Skipped under reduced motion.
const Boot = () => {
  const [lines, setLines] = useState(0);
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("srrl-boot")) return;
    sessionStorage.setItem("srrl-boot", "1");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.dataset.boot = "1";
    setShow(true);

    const timers = BOOT_LINES.map((_, i) => setTimeout(() => setLines(i + 1), 110 * (i + 1)));
    const t1 = setTimeout(() => {
      setClosing(true);
      delete root.dataset.boot;
    }, 1000);
    const t2 = setTimeout(() => setShow(false), 1450);
    return () => {
      delete root.dataset.boot;
      [...timers, t1, t2].forEach(clearTimeout);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="boot" data-closing={closing} aria-hidden="true">
      {BOOT_LINES.slice(0, lines).map((l) => (
        <div key={l} className="boot-line">
          {l}
        </div>
      ))}
    </div>
  );
};

export default Boot;
