"use client";

import { useRouter } from "next/navigation";

// "HQ" vital in the forensic strip. Double-click opens the visual system —
// a quiet way into /moodboard without cluttering the public nav.
const HqMarker = () => {
  const router = useRouter();
  const open = () => router.push("/moodboard");

  // A double-click is unreachable from the keyboard, and a focusable control that
  // does nothing on Enter is a dead end — Enter and Space stand in for it.
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  return (
    <button
      type="button"
      onDoubleClick={open}
      onKeyDown={onKeyDown}
      title="(001)"
      aria-label="(001) — double-click for the visual system"
      className="relative flex items-center gap-2 uppercase tracking-[0.14em] transition-colors before:absolute before:-inset-x-2 before:-inset-y-3.5 before:content-[''] hover:text-leaf"
    >
      <span className="inline-block size-1.5 animate-pulse bg-leaf" aria-hidden="true" />
      (001)
    </button>
  );
};

export default HqMarker;
