"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HQ } from "../../lib/feeds";

const canPlayLoops = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// One camera tile. The photo is the content; the OSD makes it a monitor. On a
// desktop pointer, hovering plays a few seconds of the feed "live" — the clip
// is only fetched on the first hover, never on load.
const Feed = ({ feed, title, clock, signal, open, onOpen, innerRef, priority }) => {
  const videoRef = useRef(null);
  const [live, setLive] = useState(false);
  const [loops, setLoops] = useState(false);

  useEffect(() => {
    setLoops(canPlayLoops());
  }, []);

  const start = () => {
    const v = videoRef.current;
    if (!v || !loops) return;
    if (!v.getAttribute("src")) v.setAttribute("src", feed.clip);
    v.play()
      .then(() => setLive(true))
      .catch(() => {});
  };

  const stop = () => {
    const v = videoRef.current;
    setLive(false);
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <button
      ref={innerRef}
      type="button"
      className="feed"
      data-open={open}
      data-signal={signal}
      data-clip={feed.clip ? "true" : undefined}
      data-live={live}
      onClick={() => onOpen(feed.id)}
      onMouseEnter={feed.clip ? start : undefined}
      onMouseLeave={feed.clip ? stop : undefined}
      onFocus={feed.clip ? start : undefined}
      onBlur={feed.clip ? stop : undefined}
      aria-label={`${feed.cam} — ${feed.label}: open`}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-keyshortcuts={feed.key}
    >
      <Image
        src={feed.image}
        alt={feed.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="feed-img"
      />
      {feed.clip && loops ? (
        <video
          ref={videoRef}
          className="feed-video"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        />
      ) : null}
      <span className="feed-static" aria-hidden="true" />
      <span className="feed-scan" aria-hidden="true" />
      <span className="feed-frame" aria-hidden="true" />
      <span className="feed-osd" aria-hidden="true">
        <span className="feed-row">
          <span>
            {feed.cam} · {feed.scene}
          </span>
          <span className="flex items-center gap-2">
            {live ? <span className="text-red">live</span> : null}
            <span className="rec" />
            <span className="tnum">{signal === "lost" ? "--:--:--" : clock.time}</span>
          </span>
        </span>
        <span className="feed-title">{title}</span>
        <span className="feed-row">
          <span>{clock.date}</span>
          <span>
            {HQ.lat} {HQ.lon}
          </span>
        </span>
      </span>
    </button>
  );
};

export default Feed;
