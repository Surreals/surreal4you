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
import Music from "./windows/Music";
import Merch from "./windows/Merch";
import Archive from "./windows/Archive";
import Subject from "./windows/Subject";
import Log from "./windows/Log";
import Map from "./windows/Map";

const WINDOWS = {
  music: { title: "cam-01 · music", width: 600 },
  merch: { title: "cam-02 · merch", width: 760 },
  archive: { title: "cam-03 · archive", width: 820 },
  subject: { title: "cam-04 · subject", width: 560 },
  log: { title: "log", width: 440 },
  map: { title: "map", width: 480 },
};

const KEYS = { l: "log", m: "map", ...Object.fromEntries(FEEDS.map((f) => [f.key, f.id])) };
const SECRET = "srrl";

let seq = 0;

// The station: four feeds, a stack of windows, a clock and a log that writes
// itself. All interaction state lives here; the pieces stay dumb.
const Station = ({ album, links, settings, products, attribution }) => {
  const clock = useClock(HQ.tz);
  const [open, setOpen] = useState([]); // [{ id, x, y, closing }] — last is on top
  const [signal, setSignal] = useState("ok");
  const [theme, setTheme] = useState("night");
  const [entries, setEntries] = useState([]);
  const feedRefs = useRef({});
  const openerRef = useRef(null);
  const layerRef = useRef(null);
  const typed = useRef("");

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
      setEntries((list) => [{ id: seq, t: stamp(), msg }, ...list].slice(0, 60));
    },
    [stamp],
  );

  // Boot entries + ambient lines every 18–35s.
  useEffect(() => {
    log("станція запущена");
    const t = setTimeout(() => log("4 камери онлайн"), 900);
    let id;
    const schedule = () => {
      id = setTimeout(() => {
        log(AMBIENT_LOG[Math.floor(Math.random() * AMBIENT_LOG.length)]);
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

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "day" ? "night" : "day";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("srrl-theme", next);
      } catch {}
      log(next === "day" ? "денний режим" : "нічний режим");
      return next;
    });
  }, [log]);

  const focusWindow = useCallback((id) => {
    setOpen((list) => {
      const i = list.findIndex((w) => w.id === id);
      if (i < 0 || i === list.length - 1) return list;
      return [...list.slice(0, i), ...list.slice(i + 1), list[i]];
    });
  }, []);

  const closeWindow = useCallback(
    (id) => {
      setOpen((list) => list.map((w) => (w.id === id ? { ...w, closing: true } : w)));
      setTimeout(() => {
        setOpen((list) => list.filter((w) => w.id !== id));
        const opener = openerRef.current;
        if (opener && opener.dataset.win === id) opener.focus({ preventScroll: true });
      }, 170);
    },
    [],
  );

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
      log(`відкрито: ${spec.title}`);
    },
    [open, closeWindow, focusWindow, log],
  );

  const moveWindow = useCallback((id, pos) => {
    setOpen((list) => list.map((w) => (w.id === id ? { ...w, ...pos } : w)));
  }, []);

  const dropSignal = useCallback(() => {
    if (signal === "lost") return;
    setSignal("lost");
    log("сигнал втрачено");
    setTimeout(() => {
      setSignal("ok");
      log("сигнал відновлено");
    }, 1800);
  }, [signal, log]);

  // Keyboard: digits open feeds, l / m the tools, t the theme, Esc closes the
  // top window. Typing the artist's tag toggles x-ray.
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
      const k = e.key.toLowerCase();
      if (k === "escape") {
        const top = [...open].reverse().find((w) => !w.closing);
        if (top) closeWindow(top.id);
        return;
      }
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
          const root = document.documentElement;
          if (root.dataset.xray) {
            delete root.dataset.xray;
            log("рентген вимкнено");
          } else {
            root.dataset.xray = "1";
            log("рентген увімкнено");
          }
          typed.current = "";
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openWindow, closeWindow, toggleTheme, log]);

  const openIds = open.map((w) => w.id);
  const ticker = [
    `${album.title} — ${(album.status ?? "").toLowerCase()}`,
    "srrlovych",
    HQ.city,
    `${HQ.lat} ${HQ.lon}`,
    "4 камери онлайн",
    "запис триває",
  ];

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
      case "log":
        return <Log entries={entries} />;
      case "map":
        return <Map clock={clock} />;
      default:
        return null;
    }
  };

  return (
    <div className="station">
      <Ticker items={ticker} />
      <StatusBar
        clock={clock}
        signal={signal}
        theme={theme}
        open={openIds}
        onRec={dropSignal}
        onToggleTheme={toggleTheme}
        onOpen={openWindow}
      />

      <div className="relative min-h-0">
        <h1 className="sr-only">Srrlovych — hip-hop artist from Uzhhorod</h1>
        <p className="font-sign py-5 text-center text-4xl text-ink lg:hidden" aria-hidden="true">
          Srrlovych
        </p>
        <div className="multiview rise lg:h-full">
          {FEEDS.map((f, i) => (
            <Feed
              key={f.id}
              feed={f}
              clock={clock}
              signal={signal}
              open={openIds.includes(f.id)}
              onOpen={openWindow}
              priority={i < 2}
              innerRef={(el) => {
                feedRefs.current[f.id] = el;
                if (el) el.dataset.win = f.id;
              }}
            />
          ))}
          <span className="signature" aria-hidden="true">
            Srrlovych
          </span>
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
      />
      <Boot />
    </div>
  );
};

export default Station;
