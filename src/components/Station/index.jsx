"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AMBIENT_LOG, FEEDS, HQ } from "../../lib/feeds";
import { useClock } from "./useClock";
import Ticker from "./Ticker";
import StatusBar from "./StatusBar";
import Feed from "./Feed";
import Window from "./Window";
import Dock from "./Dock";
import Boot from "./Boot";
import { DayHead, Desk, DayFoot } from "./DayDesk";
import Music from "./windows/Music";
import Merch from "./windows/Merch";
import Archive from "./windows/Archive";
import Subject from "./windows/Subject";
import Log from "./windows/Log";
import Map from "./windows/Map";
import Note from "./windows/Note";
import Terminal from "./windows/Terminal";

const WINDOWS = {
  music: { title: "cam-01 · music", width: 600 },
  merch: { title: "cam-02 · merch", width: 760 },
  archive: { title: "cam-03 · archive", width: 820 },
  subject: { title: "cam-04 · subject", width: 560 },
  note: { title: "note", width: 520 },
  log: { title: "log", width: 460 },
  map: { title: "map", width: 480 },
  terminal: { title: "terminal", width: 640 },
};

const KEYS = {
  l: "log",
  m: "map",
  n: "note",
  "`": "terminal",
  "~": "terminal",
  ...Object.fromEntries(FEEDS.map((f) => [f.key, f.id])),
};
const SECRET = "srrl";
const NEW_FOR_DAYS = 7;

let seq = 0;

// The station: four feeds, a stack of windows, a clock and a log that writes
// itself. All interaction state lives here; the pieces stay dumb. The day
// desk is the same station under daylight: cameras off, folders on.
const Station = ({ album, links, settings, products, note, attribution }) => {
  const clock = useClock(HQ.tz);
  const [open, setOpen] = useState([]); // [{ id, x, y, closing }] — last is on top
  const [signal, setSignal] = useState("ok");
  const [theme, setTheme] = useState("night");
  const [entries, setEntries] = useState([]);
  const feedRefs = useRef({});
  const openerRef = useRef(null);
  const layerRef = useRef(null);
  const typed = useRef("");
  const guests = useRef([]);
  const openRef = useRef(open);
  openRef.current = open;

  const stamp = useCallback(() => {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: HQ.tz,
      }).format(new Date());
    } catch {
      return "--:--:--";
    }
  }, []);

  const log = useCallback(
    (msg) => {
      seq += 1;
      setEntries((list) => [{ id: seq, t: stamp(), msg }, ...list].slice(0, 80));
    },
    [stamp],
  );

  // Boot entries, then ambient lines every 18–35s. Approved visitor lines
  // (fetched once) take every other slot while there are any left.
  useEffect(() => {
    log("station online");
    const t = setTimeout(() => log("4 cameras online"), 900);
    fetch("/api/guestbook")
      .then((r) => (r.ok ? r.json() : { lines: [] }))
      .then((d) => {
        guests.current = (d.lines ?? []).map((l) => l.msg);
      })
      .catch(() => {});
    let id;
    const schedule = () => {
      id = setTimeout(() => {
        const guest = guests.current.length && Math.random() < 0.5 ? guests.current.shift() : null;
        log(guest ?? AMBIENT_LOG[Math.floor(Math.random() * AMBIENT_LOG.length)]);
        schedule();
      }, 18000 + Math.random() * 17000);
    };
    schedule();
    return () => {
      clearTimeout(t);
      clearTimeout(id);
    };
  }, [log]);

  // An open sheet locks the page behind it (mobile only, see globals.css).
  useEffect(() => {
    const root = document.documentElement;
    if (open.length) root.dataset.modal = "1";
    else delete root.dataset.modal;
    return () => delete root.dataset.modal;
  }, [open.length]);

  // Theme was resolved before paint in layout.jsx; read it back here.
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "day" ? "day" : "night");
  }, []);

  const applyTheme = useCallback(
    (next) => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("srrl-theme", next);
      } catch {}
      log(next === "day" ? "day mode · cameras asleep" : "night mode · cameras on");
      setTheme(next);
    },
    [log],
  );

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "day" ? "night" : "day");
  }, [theme, applyTheme]);

  const focusWindow = useCallback((id) => {
    setOpen((list) => {
      const i = list.findIndex((w) => w.id === id);
      if (i < 0 || i === list.length - 1) return list;
      return [...list.slice(0, i), ...list.slice(i + 1), list[i]];
    });
  }, []);

  const closeWindow = useCallback((id) => {
    setOpen((list) => list.map((w) => (w.id === id ? { ...w, closing: true } : w)));
    setTimeout(() => {
      setOpen((list) => list.filter((w) => w.id !== id));
      const opener = openerRef.current;
      if (opener && opener.dataset.win === id) opener.focus({ preventScroll: true });
    }, 170);
  }, []);

  const closeTop = useCallback(() => {
    const top = [...openRef.current].reverse().find((w) => !w.closing);
    if (top) closeWindow(top.id);
  }, [closeWindow]);

  const closeAll = useCallback(() => {
    openRef.current.forEach((w) => closeWindow(w.id));
  }, [closeWindow]);

  const openWindow = useCallback(
    (id) => {
      const current = open.find((w) => w.id === id);
      if (current) {
        // Second press on an open window closes it; a click on a buried one
        // brings it up.
        if (open[open.length - 1]?.id === id) closeWindow(id);
        else focusWindow(id);
        return;
      }
      const layer = layerRef.current;
      const n = open.length;
      const spec = WINDOWS[id];
      let x = 24 + n * 28;
      let y = 24 + n * 28;
      if (layer) {
        const w = Math.min(spec.width, layer.clientWidth - 24);
        x = Math.max(12, Math.min(x + (layer.clientWidth - w) / 2 - 120, layer.clientWidth - w - 12));
        y = Math.max(12, Math.min(y, layer.clientHeight * 0.35));
      }
      openerRef.current = feedRefs.current[id] ?? null;
      setOpen((list) => [...list, { id, x, y }]);
      log(`opened: ${spec.title}`);
    },
    [open, closeWindow, focusWindow, log],
  );

  const moveWindow = useCallback((id, pos) => {
    setOpen((list) => list.map((w) => (w.id === id ? { ...w, ...pos } : w)));
  }, []);

  const dropSignal = useCallback(() => {
    if (signal === "lost") return;
    setSignal("lost");
    log("signal lost");
    setTimeout(() => {
      setSignal("ok");
      log("signal restored");
    }, 1800);
  }, [signal, log]);

  const toggleXray = useCallback(() => {
    const root = document.documentElement;
    if (root.dataset.xray) {
      delete root.dataset.xray;
      log("x-ray off");
      return false;
    }
    root.dataset.xray = "1";
    log("x-ray on");
    return true;
  }, [log]);

  // A visitor's line: posted for review, shown to them at once.
  const sendLine = useCallback(
    async (msg) => {
      try {
        const res = await fetch("/api/guestbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ msg }),
        });
        if (res.ok) {
          const d = await res.json();
          log(d.msg ?? msg.toLowerCase());
          return { ok: true };
        }
        if (res.status === 429) {
          const d = await res.json().catch(() => ({}));
          return { ok: false, error: d.error === "visitor cap" ? "that is enough lines from you" : "too fast · wait a minute" };
        }
        if (res.status === 422) return { ok: false, error: "line rejected · 2–80 chars, no links" };
        return { ok: false, error: "station busy · try later" };
      } catch {
        return { ok: false, error: "no connection" };
      }
    },
    [log],
  );

  // Keyboard: digits open feeds, letters the tools, t the theme, Esc closes
  // the top window. Typing the artist's tag toggles x-ray.
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable;
      const k = e.key.toLowerCase();
      if (k === "escape") {
        closeTop();
        return;
      }
      if (typing) return;
      if (k === "t") {
        toggleTheme();
        return;
      }
      if (KEYS[k]) {
        e.preventDefault();
        openWindow(KEYS[k]);
      }
      if (k.length === 1) {
        typed.current = (typed.current + k).slice(-SECRET.length);
        if (typed.current === SECRET) {
          toggleXray();
          typed.current = "";
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openWindow, closeTop, toggleTheme, toggleXray]);

  const openIds = open.map((w) => w.id);
  const isDay = theme === "day";
  const noteIsNew = (() => {
    const d = Date.parse(note?.date ?? "");
    return Number.isFinite(d) && Date.now() - d < NEW_FOR_DAYS * 86400000;
  })();
  const ticker = [
    `${album.title} — ${(album.status ?? "").toLowerCase()}`,
    "srrlovych",
    HQ.city,
    `${HQ.lat} ${HQ.lon}`,
    settings.showStore ? "4 cameras online" : "3 cameras online · cam-02 offline",
    "recording",
  ];

  const terminalApi = {
    open: openWindow,
    close: (id) => (id ? closeWindow(id) : closeTop()),
    closeAll,
    entries: () => entries,
    note: () => note,
    album: () => album,
    links: () => [...links.main, ...links.side],
    clock: () => clock,
    theme: () => theme,
    setTheme: applyTheme,
    toggleTheme,
    dropSignal,
    toggleXray,
    offline: (id) => id === "merch" && !settings.showStore,
  };

  const render = (id) => {
    switch (id) {
      case "music":
        return <Music album={album} links={links} />;
      case "merch":
        return <Merch products={products} showStore={settings.showStore} />;
      case "archive":
        return <Archive />;
      case "subject":
        return <Subject album={album} links={links} />;
      case "note":
        return <Note note={note} />;
      case "log":
        return <Log entries={entries} onSend={sendLine} />;
      case "map":
        return <Map clock={clock} />;
      case "terminal":
        return <Terminal api={terminalApi} />;
      default:
        return null;
    }
  };

  return (
    <div className="station">
      <Ticker items={ticker} className="night-only" />
      <StatusBar
        clock={clock}
        signal={signal}
        open={openIds}
        onRec={dropSignal}
        onToggleTheme={toggleTheme}
        onOpen={openWindow}
        noteIsNew={noteIsNew}
      />
      <DayHead clock={clock} onToggleTheme={toggleTheme} />

      <div className="relative min-h-0">
        <h1 className="sr-only">Srrlovych — hip-hop artist from Uzhhorod</h1>
        <Desk note={note} open={openIds} onOpen={openWindow} />
        <div className="night-only lg:h-full">
          <p className="font-sign py-5 text-center text-4xl text-ink lg:hidden" aria-hidden="true">
            Srrlovych
          </p>
          <div className="multiview rise lg:h-full">
            {FEEDS.map((f, i) => {
              const offline = f.id === "merch" && !settings.showStore;
              return (
                <Feed
                  key={f.id}
                  feed={offline ? f : { ...f, offline: undefined }}
                  title={f.title ?? album.title}
                  clock={clock}
                  signal={signal}
                  open={openIds.includes(f.id)}
                  active={!isDay}
                  onOpen={openWindow}
                  priority={i < 2}
                  innerRef={(el) => {
                    feedRefs.current[f.id] = el;
                    if (el) el.dataset.win = f.id;
                  }}
                />
              );
            })}
            <span className="signature" aria-hidden="true">
              Srrlovych
            </span>
          </div>
        </div>

        {/* Window layer: ignores the pointer; windows take it back. */}
        <div ref={layerRef} className="pointer-events-none absolute inset-0 z-30 lg:overflow-hidden">
          {open.map((w, i) => (
            <Window
              key={w.id}
              id={w.id}
              title={WINDOWS[w.id].title}
              width={WINDOWS[w.id].width}
              x={w.x}
              y={w.y}
              focused={i === open.length - 1}
              closing={Boolean(w.closing)}
              onFocus={focusWindow}
              onClose={closeWindow}
              onMove={moveWindow}
            >
              {render(w.id)}
            </Window>
          ))}
        </div>
      </div>

      <Dock
        album={album}
        links={links}
        onOpen={openWindow}
        musicOpen={openIds.includes("music")}
        attribution={attribution}
        className="night-only"
      />
      <DayFoot links={links} attribution={attribution} />
      <Boot />
    </div>
  );
};

export default Station;
