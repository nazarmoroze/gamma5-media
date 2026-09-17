"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

import styles from "./DisableDraftMode.module.css";

// Shown when someone opens the site in Draft Mode outside Studio's Presentation tool.
export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();
  if (isPresentationTool !== false) return null;

  return (
    <a href="/api/draft-mode/disable" className={styles.button}>
      Exit preview
    </a>
  );
}
