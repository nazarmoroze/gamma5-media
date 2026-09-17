import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}

type WithHotspot = { hotspot?: { x?: number; y?: number } | null } | null | undefined;

// Keeps the editor's focal point when the image is cropped with object-fit: cover.
export function hotspotPosition(image: WithHotspot) {
  const x = image?.hotspot?.x;
  const y = image?.hotspot?.y;
  if (typeof x !== "number" || typeof y !== "number") return undefined;
  return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
}
