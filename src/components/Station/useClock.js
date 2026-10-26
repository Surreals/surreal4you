"use client";

import { useEffect, useState } from "react";

const EMPTY = { time: "--:--:--", date: "--.--.----", hour: 0 };

// Uzhhorod wall clock, ticking once a second. One instance feeds the status
// bar and every camera OSD so they never drift apart.
export const useClock = (timeZone) => {
  const [now, setNow] = useState(EMPTY);

  useEffect(() => {
    const timeFmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone,
    });
    const dateFmt = new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone,
    });
    const tick = () => {
      const d = new Date();
      const time = timeFmt.format(d);
      setNow({ time, date: dateFmt.format(d), hour: Number(time.slice(0, 2)) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return now;
};
