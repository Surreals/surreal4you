"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HQ } from "../../lib/feeds";

// Loops run unless the visitor asked for less motion or less data.
const wantsLoops = () =>
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !navigator.connection?.saveData;

// One camera tile. A few seconds of the feed loop over the poster; the poster
// stays until the clip is really playing, so a browser that cannot decode it
// just shows the photo. `active` pauses the loops while the desk is up.
const Feed = ({ feed, title, clock, signal, open, active, onOpen, innerRef, priority }) => {
  const videoRef = useRef(null);
  const [live, setLive] = useState(false);
  const [loops, setLoops] = useState(false);
  const offline = Boolean(feed.offline);
  const view = offline ? { ...feed, ...feed.offline } : feed;

  useEffect(() => {
    setLoops(wantsLoops());
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !loops || !view.clip) return;
    const play = () => {
      if (!v.getAttribute("src")) v.setAttribute("src", view.clip);
      v.play().catch(() => setLive(false));
    };
    const pause = () => {
      v.pause();
      setLive(false);
    };
    const onVisibility = () => (document.hidden || !active ? pause() : play());
    if (active) play();
    else pause();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [loops, active, view.clip]);

  return (
    <button
      ref={innerRef}
      type="button"
      className="feed"
      data-open={open}
      data-signal={signal}
      data-offline={offline || undefined}
      data-live={live}
      onClick={() => onOpen(feed.id)}
      aria-label={`${feed.cam} — ${feed.label}: open`}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-keyshortcuts={feed.key}
    >
      <Image
        src={view.image}
        alt={view.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="feed-img"
      />
      {view.clip && loops ? (
        <video
          ref={videoRef}
          className="feed-video"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setLive(true)}
          onPause={() => setLive(false)}
          onError={() => setLive(false)}
        />
      ) : null}
      <span className="feed-static" aria-hidden="true" />
      <span className="feed-scan" aria-hidden="true" />
      <span className="feed-frame" aria-hidden="true" />
      <span className="feed-osd" aria-hidden="true">
        <span className="feed-row">
          <span>
            {feed.cam} · {view.scene}
          </span>
          <span className="flex items-center gap-2">
            {offline ? (
              <span className="text-red">no signal</span>
            ) : (
              <>
                {live ? <span className="text-red">live</span> : null}
                <span className="rec" />
                <span className="tnum">{signal === "lost" ? "--:--:--" : clock.time}</span>
              </>
            )}
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
