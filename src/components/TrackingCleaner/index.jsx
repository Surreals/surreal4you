"use client";

import { useEffect } from "react";

// Strips marketing tracking params from the URL after load, without a reload.
const TRACKING_PARAMS = [
  "fbclid",
  "gclid",
  "gbraid",
  "wbraid",
  "mc_cid",
  "mc_eid",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term",
];

const TrackingCleaner = () => {
  useEffect(() => {
    const url = new URL(window.location.href);
    let changed = false;

    TRACKING_PARAMS.forEach((param) => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        changed = true;
      }
    });

    if (changed) {
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }, []);

  return null;
};

export default TrackingCleaner;
