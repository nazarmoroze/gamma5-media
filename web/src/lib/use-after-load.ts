"use client";

import { useEffect, useState } from "react";

// True once the page has finished loading and the browser is idle. Used to start heavy media
// (background and preview videos) only after the first screen is painted.
export function useAfterLoad() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let handle: number | undefined;
    const start = () => {
      handle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
        : window.setTimeout(() => setReady(true), 200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      if (handle === undefined) return;
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return ready;
}
