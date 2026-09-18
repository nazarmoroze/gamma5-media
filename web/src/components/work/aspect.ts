import { stegaClean } from "next-sanity";

// "2.39:1" from Sanity becomes a CSS aspect-ratio plus its number. Falls back to the case orientation.
export function videoAspect(value: string | null | undefined, vertical: boolean) {
  const clean = stegaClean(value);
  const parts = clean && /^\d+(\.\d+)?:\d+(\.\d+)?$/.test(clean) ? clean.split(":").map(Number) : null;
  const [width, height] = parts ?? (vertical ? [9, 16] : [16, 9]);
  return { css: `${width} / ${height}`, ratio: width / height };
}
