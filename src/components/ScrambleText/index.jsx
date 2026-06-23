"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*";

// Decode-on-hover. The real text is rendered invisibly to reserve width so the
// scramble never shifts surrounding layout.
const ScrambleText = ({ text }) => {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = () => {
    cancelAnimationFrame(raf.current);
    const total = Math.max(8, text.length + 4);
    let frame = 0;
    const step = () => {
      frame += 1;
      const revealed = Math.floor((frame / total) * text.length);
      const next = text
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < revealed) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      setOut(next);
      if (frame < total) raf.current = requestAnimationFrame(step);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <span className="relative inline-block" onMouseEnter={run}>
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span className="absolute left-0 top-0 whitespace-nowrap">{out}</span>
    </span>
  );
};

export default ScrambleText;
