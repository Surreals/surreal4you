"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { HQ, SPOTS } from "../../lib/feeds";
import { useClock } from "./useClock";
import StatusBar from "./StatusBar";
import Scene from "./Scene";
import Window from "./Window";
import Dock from "./Dock";
import Boot from "./Boot";
import Music from "./windows/Music";
import Merch from "./windows/Merch";
import Archive from "./windows/Archive";
import Subject from "./windows/Subject";
import Log from "./windows/Log";
import Map from "./windows/Map";
import Note from "./windows/Note";
import Terminal from "./windows/Terminal";

// The ways to look at the block he walks on: the painting, the same painting
// with depth, and a model to turn. `icon` is the path of a 16px sign.
const VIEWS = [
  { id: "flat", label: "painting", hint: "click the ground to walk.", icon: "M2.5 3.5h11v9h-11z" },
  { id: "depth", label: "depth", hint: "click to walk · point to lean.", icon: "M2.5 5.5h8v7h-8zM5.5 5.5v-2h8v7h-3" },
  { id: "model", label: "model", hint: "click to walk · drag to turn.", icon: "M8 1.8 13.5 5v6L8 14.2 2.5 11V5zM2.5 5 8 8.2 13.5 5M8 8.2v6" },
];

const WINDOWS = {
  music: { title: "stands · music", width: 600 },
  merch: { title: "kiosk · merch", width: 760 },
  archive: { title: "garage · archive", width: 820 },
  subject: { title: "lamp · subject", width: 560 },
  note: { title: "board · note", width: 520 },
  log: { title: "booth · log", width: 460 },
  map: { title: "mast · map", width: 480 },
  terminal: { title: "terminal", width: 640 },
};

const KEYS = {
  "`": "terminal",
  "~": "terminal",
  ...Object.fromEntries(SPOTS.map((s) => [s.key, s.id])),
};
const SECRET = "srrl";
const NEW_FOR_DAYS = 7;
const CLOSE_MS = 320; // outlasts the longest way out (the 300ms sheet) in globals.css

let seq = 0;

const Play = () => (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
    <path d="M5.5 4 12.5 8 5.5 12Z" />
  </svg>
);

// The station: one block, a stack of windows, a clock and a log that writes
// itself. All interaction state lives here; the pieces stay dumb. Day and
// night are the same block under different light.
const Station = ({ album, links, settings, products, note, texts, attribution }) => {
  const clock = useClock(HQ.tz);
  const [open, setOpen] = useState([]); // [{ id, x, y, closing }] — last is on top
  const [signal, setSignal] = useState("ok");
  const [theme, setTheme] = useState("night");
  const [view, setView] = useState("flat");
  const [entries, setEntries] = useState([]);
  const feedRefs = useRef({});
  const openerRef = useRef(null);
  const layerRef = useRef(null);
  const typed = useRef("");
  const guests = useRef([]);
  const closeTimers = useRef({});
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
    log("the block is lit");
    const t = setTimeout(
      () => log(settings.showStore ? "4 cameras online" : "3 cameras online · cam-02 no signal"),
      900,
    );
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
        log(guest ?? texts.log[Math.floor(Math.random() * texts.log.length)]);
        schedule();
      }, 18000 + Math.random() * 17000);
    };
    schedule();
    return () => {
      clearTimeout(t);
      clearTimeout(id);
    };
  }, [log, settings.showStore, texts.log]);

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

  // The button crossfades the whole frame (a hard jump between dark and light
  // is the one change here that hurts the eyes); the key and the terminal
  // switch at once, like every other shortcut.
  const applyTheme = useCallback(
    (next, fade = false) => {
      try {
        localStorage.setItem("srrl-theme", next);
      } catch {}
      log(next === "day" ? "daylight · everything looks normal" : "night · the lamp points up");
      const flip = () => {
        document.documentElement.dataset.theme = next;
        flushSync(() => setTheme(next));
      };
      if (!fade || !document.startViewTransition) return flip();
      document.startViewTransition(async () => {
        flip();
        // hold the old frame until the other picture of the block is ready, half a second at most
        const img = document.querySelector(`.scene > .${next}-only`);
        if (img) await Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 500))]);
      });
    },
    [log],
  );

  const toggleTheme = useCallback(
    (fade) => {
      applyTheme(theme === "day" ? "night" : "day", fade === true);
    },
    [theme, applyTheme],
  );

  const focusWindow = useCallback((id) => {
    setOpen((list) => {
      const i = list.findIndex((w) => w.id === id);
      if (i < 0 || i === list.length - 1) return list;
      return [...list.slice(0, i), ...list.slice(i + 1), list[i]];
    });
  }, []);

  // `quick` is a key or a typed command: no way-out animation, the window is
  // just gone.
  const closeWindow = useCallback((id, quick = false) => {
    const done = () => {
      setOpen((list) => list.filter((w) => w.id !== id));
      const opener = openerRef.current;
      if (opener && opener.dataset.win === id) opener.focus({ preventScroll: true });
    };
    clearTimeout(closeTimers.current[id]);
    if (quick) return done();
    setOpen((list) => list.map((w) => (w.id === id ? { ...w, closing: true, quick: false } : w)));
    closeTimers.current[id] = setTimeout(done, CLOSE_MS);
  }, []);

  const closeTop = useCallback(
    (quick) => {
      const top = [...openRef.current].reverse().find((w) => !w.closing);
      if (top) closeWindow(top.id, quick);
    },
    [closeWindow],
  );

  const closeAll = useCallback(() => {
    openRef.current.forEach((w) => closeWindow(w.id, true));
  }, [closeWindow]);

  const openWindow = useCallback(
    (id, quick = false) => {
      const current = open.find((w) => w.id === id);
      if (current?.closing) {
        // Caught on its way out: it turns round from where it is.
        clearTimeout(closeTimers.current[id]);
        setOpen((list) => [...list.filter((w) => w.id !== id), { ...current, closing: false, quick }]);
        return;
      }
      if (current) {
        // Second press on an open window closes it; a click on a buried one
        // brings it up.
        if (open[open.length - 1]?.id === id) closeWindow(id, quick);
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
      setOpen((list) => [...list, { id, x, y, quick }]);
      log(`entered: ${spec.title}`);
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

  // Keyboard: digits open the cameras, letters the tools, t the theme, Esc closes
  // the top window. Typing the artist's tag toggles x-ray.
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable;
      const k = e.key.toLowerCase();
      if (k === "escape") {
        closeTop(true);
        return;
      }
      if (typing) return;
      if (k === "t") {
        toggleTheme();
        return;
      }
      if (KEYS[k]) {
        e.preventDefault();
        openWindow(KEYS[k], true);
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
  const noteIsNew = (() => {
    const d = Date.parse(note?.date ?? "");
    return Number.isFinite(d) && Date.now() - d < NEW_FOR_DAYS * 86400000;
  })();
  const terminalApi = {
    open: (id) => openWindow(id, true),
    close: (id) => (id ? closeWindow(id, true) : closeTop(true)),
    closeAll,
    entries: () => entries,
    note: () => note,
    album: () => album,
    dossier: () => texts.dossier,
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
        return <Subject album={album} links={links} dossier={texts.dossier} />;
      case "note":
        return <Note note={note} />;
      case "log":
        return <Log entries={entries} onSend={sendLine} />;
      case "map":
        return <Map clock={clock} text={texts.map} />;
      case "terminal":
        return <Terminal api={terminalApi} />;
      default:
        return null;
    }
  };

  return (
    <div className="station">
      <StatusBar
        clock={clock}
        signal={signal}
        theme={theme}
        open={openIds}
        onRec={dropSignal}
        onToggleTheme={() => toggleTheme(true)}
        onOpen={openWindow}
        noteIsNew={noteIsNew}
      />

      <div className="relative min-h-0 min-w-0">
        <h1 className="sr-only">SRRLOVYCH — hip-hop from Uzhhorod</h1>
        <div className="era">
          <p className="era-title rise">{album.title}</p>
          <button
            type="button"
            className="ctl border-ink rise"
            onClick={() => openWindow("music")}
            aria-pressed={openIds.includes("music")}
          >
            <Play />
            {(album.status ?? "").toLowerCase()} · listen
          </button>
        </div>
        <Scene
          album={album}
          note={note}
          labels={texts.spots}
          open={openIds}
          signal={signal}
          merchOffline={!settings.showStore}
          view={view}
          theme={theme}
          onOpen={openWindow}
          spotRefs={feedRefs}
        />
        <div className="lede rise">
          <span className="text-ink">{VIEWS.find((v) => v.id === view).hint}</span>
          <span className="views" role="group" aria-label="view of the block">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                className="ctl"
                onClick={() => setView(v.id)}
                aria-pressed={view === v.id}
                aria-label={v.label}
                title={v.label}
              >
                <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d={v.icon} />
                </svg>
              </button>
            ))}
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
              quick={Boolean(w.quick)}
              origin={feedRefs.current[w.id]}
              onFocus={focusWindow}
              onClose={closeWindow}
              onMove={moveWindow}
            >
              {render(w.id)}
            </Window>
          ))}
        </div>
      </div>

      <Dock links={links} attribution={attribution} />
      <Boot merchOffline={!settings.showStore} />
    </div>
  );
};

export default Station;
