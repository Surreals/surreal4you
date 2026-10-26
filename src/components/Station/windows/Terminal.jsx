"use client";

import { useEffect, useRef, useState } from "react";
import { FEEDS, HQ } from "../../../lib/feeds";

const PROMPT = "srrl@uzh:~$";
const WINDOW_IDS = ["music", "merch", "archive", "subject", "note", "log", "map", "terminal"];

const HELP = [
  "commands:",
  "  cams                 list cameras",
  "  open <window>        music · merch · archive · subject · note · log · map",
  "  close [window|all]   close a window (default: the top one)",
  "  log [n]              last n log entries",
  "  note                 read the note",
  "  whois srrl           the dossier",
  "  links                every channel",
  "  theme [day|night]    switch the station",
  "  signal               drop the signal for a moment",
  "  xray                 toggle x-ray",
  "  time                 uzhhorod clock",
  "  clear · exit",
];

// A console into the station. Every command maps onto something the station
// can already do; the terminal only gives it a second, quieter door.
const Terminal = ({ api }) => {
  const [lines, setLines] = useState(() => [
    { t: "out", s: "srrl station · shell 0.1" },
    { t: "out", s: "type help" },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const print = (...out) =>
    setLines((l) => [...l, ...out.map((s) => ({ t: "out", s }))].slice(-200));

  const run = (raw) => {
    const input = raw.trim();
    if (!input) return;
    setLines((l) => [...l, { t: "in", s: input }]);
    setHistory((h) => [input, ...h].slice(0, 50));
    setCursor(-1);
    const [cmd, ...rest] = input.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");

    switch (cmd) {
      case "help":
      case "?":
        print(...HELP);
        break;
      case "cams":
        print(
          ...FEEDS.map(
            (f) => `  ${f.cam}  ${f.label.padEnd(8)} ${api.offline(f.id) ? "offline" : f.scene}`,
          ),
        );
        break;
      case "open":
        if (WINDOW_IDS.includes(arg) && arg !== "terminal") {
          api.open(arg);
          print(`opening ${arg}`);
        } else print(`open: unknown window "${arg}"`);
        break;
      case "close":
        if (!arg) api.close();
        else if (arg === "all") api.closeAll();
        else if (WINDOW_IDS.includes(arg)) api.close(arg);
        else print(`close: unknown window "${arg}"`);
        break;
      case "log": {
        const n = Math.min(Math.max(parseInt(arg || "8", 10) || 8, 1), 40);
        const entries = api.entries().slice(0, n);
        print(...entries.map((e) => `  ${e.t}  ${e.msg}`));
        break;
      }
      case "note": {
        const note = api.note();
        print(`${note.title}.txt · ${note.date}`, ...note.body.split("\n").map((s) => `  ${s}`), "  — srrl");
        break;
      }
      case "whois":
        if (!arg || /srrl|surreal/.test(arg)) {
          print(
            "  name     srrlovych",
            "  aka      srrl · surrealovych",
            `  city     ${HQ.city} · ${HQ.lat} ${HQ.lon}`,
            "  genre    hip-hop",
            `  album    ${api.album().title} · ${(api.album().status ?? "").toLowerCase()}`,
            "  status   under observation",
          );
        } else print(`whois: no record for "${arg}"`);
        break;
      case "links":
        print(...api.links().map((l) => `  ${l.name.toLowerCase().padEnd(10)} ${l.url}`));
        break;
      case "play":
        api.open("music");
        print("opening music");
        break;
      case "theme":
        {
          const next = arg === "day" || arg === "night" ? arg : api.theme() === "day" ? "night" : "day";
          api.setTheme(next);
          print(`theme: ${next}`);
        }
        break;
      case "signal":
        api.dropSignal();
        print("signal lost · restoring");
        break;
      case "xray":
        print(`x-ray ${api.toggleXray() ? "on" : "off"}`);
        break;
      case "time":
        print(`  ${api.clock().time}  ${api.clock().date}  ${HQ.tz}`);
        break;
      case "hehemonia":
      case "гегемонія":
        print(`  ${api.album().title} — ${(api.album().status ?? "").toLowerCase()}`, "  spotify · apple · youtube");
        api.open("music");
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        api.close("terminal");
        break;
      case "sudo":
        print("nice try. the station runs on trust.");
        break;
      case "ls":
        print("  music  merch  archive  subject  note.txt  log  map");
        break;
      case "pwd":
        print(`  /uzhhorod/${HQ.lat}_${HQ.lon}`);
        break;
      default:
        print(`${cmd}: command not found. try help`);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      setCursor(next);
      setValue(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(cursor - 1, -1);
      setCursor(next);
      setValue(next === -1 ? "" : history[next]);
    }
    // Esc still bubbles to the station and closes the window.
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-out">
        {lines.map((l, i) => (
          <div key={i} className={l.t === "in" ? "text-ink" : "text-dim"}>
            {l.t === "in" ? (
              <>
                <span className="text-red">{PROMPT}</span> {l.s}
              </>
            ) : (
              l.s
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <label className="terminal-in">
        <span className="text-red">{PROMPT}</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="terminal input"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </label>
    </div>
  );
};

export default Terminal;
