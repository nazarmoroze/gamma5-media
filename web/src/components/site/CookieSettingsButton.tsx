"use client";

import { COOKIE_SETTINGS_EVENT } from "./CookieConsent";

// Brings the cookie banner back so a visitor can change their mind.
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}>
      Cookie settings
    </button>
  );
}
