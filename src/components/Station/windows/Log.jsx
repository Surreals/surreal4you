"use client";

import { useState } from "react";

const MAX = 80;

// The station's event log, newest first, with a line for the visitor at the
// bottom. Real events, ambient lines and approved visitor lines share one
// list on purpose — the reader should not be sure which is which.
const Log = ({ entries, onSend }) => {
  const [value, setValue] = useState("");
  const [state, setState] = useState({ kind: "idle" });

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
        <ol className="log" aria-live="polite">
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
          placeholder="leave a line in the log"
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
