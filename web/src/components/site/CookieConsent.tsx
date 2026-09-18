"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import { useSyncExternalStore } from "react";

import { useAfterLoad } from "@/lib/use-after-load";

import styles from "./CookieConsent.module.css";

const STORAGE_KEY = "gamma5-cookie-consent";
export const COOKIE_SETTINGS_EVENT = "gamma5:cookie-settings";

type Choice = "granted" | "denied";
// "pending" on the server and until the first client read, so both renders match.
type State = Choice | "pending" | "asking";

// The choice lives in localStorage; this store keeps every tab and the footer link in sync with it.
const listeners = new Set<() => void>();
let reopened = false;

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  const reopen = () => {
    reopened = true;
    emit();
  };
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
    window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
  };
}

function getSnapshot(): State {
  if (reopened) return "asking";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "granted" || stored === "denied") return stored;
  } catch {
    // Private mode or blocked storage: ask again on every visit.
  }
  return "asking";
}

function decide(choice: Choice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Not storing the choice only means we ask again later.
  }
  reopened = false;
  emit();
}

export function CookieConsent({ gaId }: { gaId: string }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, (): State => "pending");
  // Let the page load and settle first: the banner arrives on its own, not together with everything else.
  const ready = useAfterLoad(900);

  return (
    <>
      {ready && state === "granted" && <GoogleAnalytics gaId={gaId} />}
      {ready && state === "asking" && (
        <aside className={styles.banner} role="dialog" aria-labelledby="cookie-title">
          <span className={styles.corners} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>

          <div className={styles.hud} aria-hidden="true">
            <span className={styles.rec}>
              <span className={styles.dot} />
              REC
            </span>
            <span>ANALYTICS · OFF</span>
          </div>

          <h2 id="cookie-title" className={styles.title}>
            Can we count the views?
          </h2>
          <p className={styles.text}>
            Google Analytics tells us which work people watch. No ads, no profiles, no selling data. Details in our{" "}
            <Link href="/privacy-policy" className={styles.link}>
              Privacy Policy
            </Link>
            .
          </p>

          <div className={styles.actions}>
            <button type="button" className={`btn btn-red ${styles.accept}`} onClick={() => decide("granted")}>
              Accept
            </button>
            <button type="button" className={styles.decline} onClick={() => decide("denied")}>
              Decline
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
