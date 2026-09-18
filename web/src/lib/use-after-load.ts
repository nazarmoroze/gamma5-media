"use client";

import { useEffect, useState } from "react";

// True once the page has finished loading and the browser is idle, plus an optional pause.
// Used to start heavy media (background and preview videos) and to let the cookie banner
// arrive after the page has settled instead of with everything else.
export function useAfterLoad(delayMs = 0) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle: number | undefined;
    let timer: number | undefined;

    const finish = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
        : window.setTimeout(() => setReady(true), 200);
    };
    const start = () => {
      timer = window.setTimeout(finish, delayMs);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      if (timer !== undefined) window.clearTimeout(timer);
      if (idle === undefined) return;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [delayMs]);

  return ready;
}
