"use client";

import { useRouter } from "next/navigation";

// "HQ" vital in the forensic strip. Double-click opens the visual system —
// a quiet way into /moodboard without cluttering the public nav.
const HqMarker = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      onDoubleClick={() => router.push("/moodboard")}
      title="(001)"
      aria-label="(001) — double-click for the visual system"
      className="flex items-center gap-2 uppercase tracking-[0.14em] transition-colors hover:text-xray"
    >
      <span className="inline-block size-1.5 animate-pulse bg-signal" aria-hidden="true" />
      (001)
    </button>
  );
};

export default HqMarker;
