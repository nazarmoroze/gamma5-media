"use client";

import dynamic from "next/dynamic";

// Editor-only tools. Loaded lazily so visitors never download the Visual Editing bundle,
// which would otherwise ship with the root layout on every page.
const VisualEditing = dynamic(() => import("next-sanity/visual-editing").then((mod) => mod.VisualEditing), {
  ssr: false,
});
const DisableDraftMode = dynamic(() => import("./DisableDraftMode").then((mod) => mod.DisableDraftMode), {
  ssr: false,
});

export function DraftModeTools() {
  return (
    <>
      <DisableDraftMode />
      <VisualEditing />
    </>
  );
}
