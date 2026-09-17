import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

import { dataset, projectId } from "@/sanity/env";

export const SITE_NAME = "GAMMA5";

// Used whenever a page has no share image of its own in Sanity.
export const DEFAULT_SHARE_IMAGE = {
  url: "/og-default.jpg",
  width: 1200,
  height: 630,
  alt: "GAMMA5 — Full-Cycle Video Production",
};

type ShareImageValue =
  | {
      alt?: string | null;
      hotspot?: { x?: number; y?: number; width?: number; height?: number } | null;
      crop?: { top?: number; bottom?: number; left?: number; right?: number } | null;
      asset?: { _id: string } | null;
    }
  | null
  | undefined;

const builder = createImageUrlBuilder({ projectId, dataset });

// 1200 × 630 crop around the editor's hotspot, in the uploaded format. No auto-format, so crawlers always get JPG or PNG.
export function shareImage(image: ShareImageValue) {
  const value = stegaClean(image);
  const id = value?.asset?._id;
  if (!id) return DEFAULT_SHARE_IMAGE;

  const url = builder
    .image(value as SanityImageSource)
    .width(DEFAULT_SHARE_IMAGE.width)
    .height(DEFAULT_SHARE_IMAGE.height)
    .fit("crop")
    .format(id.endsWith("-png") ? "png" : "jpg")
    .url();

  return { url, width: DEFAULT_SHARE_IMAGE.width, height: DEFAULT_SHARE_IMAGE.height, alt: value.alt || DEFAULT_SHARE_IMAGE.alt };
}

type PageMetadataInput = {
  title: string;
  description?: string | null;
  path: string;
  image?: ShareImageValue;
  type?: "website" | "article";
};

// Full Open Graph and X card for a page. Next.js replaces the layout's openGraph object instead of merging it,
// so every page sets all fields itself.
export function pageMetadata({ title, description, path, image, type = "website" }: PageMetadataInput): Metadata {
  const share = shareImage(image);
  const fullTitle = `${title} | ${SITE_NAME}`;
  const text = description ?? undefined;

  return {
    title,
    description: text,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: fullTitle,
      description: text,
      images: [share],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: text,
      images: [{ url: share.url, alt: share.alt }],
    },
  };
}
