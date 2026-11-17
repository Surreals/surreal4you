"use client";

import { useLayoutEffect, useRef, useState } from "react";

const MAX = 80;

// The station's event log, newest first, with a line for the visitor at the
// bottom. Real events, ambient lines and approved visitor lines share one
// list on purpose — the reader should not be sure which is which.
const Log = ({ entries, onSend }) => {
  const [value, setValue] = useState("");
  const [state, setState] = useState({ kind: "idle" });
  const listRef = useRef(null);
  const topId = entries[0]?.id;
  const seen = useRef(topId);

  // A new line pushes the list down one row and fades in, instead of the
  // whole list jumping. Not on open: the window is already arriving.
  useLayoutEffect(() => {
    if (seen.current === topId) return;
    seen.current = topId;
    const ol = listRef.current;
    const li = ol?.firstElementChild;
    if (!li || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timing = { duration: 250, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }; // --ease-out
    ol.animate([{ transform: `translateY(-${li.offsetHeight}px)` }, { transform: "none" }], timing);
    li.animate([{ opacity: 0 }, { opacity: 1 }], timing);
  }, [topId]);

  const submit = async (e) => {
    e.preventDefault();
    const msg = value.trim();
    if (!msg || state.kind === "sending") return;
    setState({ kind: "sending" });
    const result = await onSend(msg);
    if (result.ok) {
      setValue("");
      setState({ kind: "sent" });
    } else {
      setState({ kind: "error", msg: result.error });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="p-4 sm:p-5">
        <ol ref={listRef} className="log" aria-live="polite">
          {entries.map((e) => (
            <li key={e.id}>
              <time className="tnum">{e.t}</time>
              <span>{e.msg}</span>
            </li>
          ))}
        </ol>
      </div>
      <form className="composer" onSubmit={submit}>
        <input
          value={value}
          maxLength={MAX}
          onChange={(e) => {
            setValue(e.target.value);
            if (state.kind !== "idle") setState({ kind: "idle" });
          }}
          placeholder="leave a line. the booth reads everything"
          aria-label="leave a line in the log"
          autoComplete="off"
        />
        <button type="submit" className="ctl" disabled={state.kind === "sending" || !value.trim()}>
          send
        </button>
        <span className="composer-note tnum">
          {state.kind === "sent"
            ? "logged · public after review"
            : state.kind === "error"
              ? state.msg
              : state.kind === "sending"
                ? "sending"
                : `${value.length}/${MAX}`}
        </span>
      </form>
    </div>
  );
};

export default Log;
