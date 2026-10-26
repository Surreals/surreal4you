import Image from "next/image";
import { HQ } from "../../lib/feeds";

// One camera tile. The photo is the content; the OSD makes it a monitor.
const Feed = ({ feed, clock, signal, open, onOpen, innerRef, priority }) => {
  return (
    <button
      ref={innerRef}
      type="button"
      className="feed"
      data-open={open}
      data-signal={signal}
      onClick={() => onOpen(feed.id)}
      aria-label={`${feed.cam} — ${feed.label}: відкрити`}
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
      <span className="feed-static" aria-hidden="true" />
      <span className="feed-scan" aria-hidden="true" />
      <span className="feed-frame" aria-hidden="true" />
      <span className="feed-osd" aria-hidden="true">
        <span className="feed-row">
          <span>
            {feed.cam} · {feed.label}
          </span>
          <span className="flex items-center gap-2">
            <span className="rec" />
            <span className="tnum">{signal === "lost" ? "--:--:--" : clock.time}</span>
          </span>
        </span>
        <span className="feed-title">{feed.title}</span>
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
