import type { Metadata } from "next";

import { site } from "@/content/home";

// Page-level openGraph replaces the layout's object, so pages spread these defaults.
export const openGraphDefaults = {
  siteName: site.name,
  locale: "en_US",
  images: [{ url: "/media/house.jpg", width: 1146, height: 525, alt: "Aerial real estate video frame by GAMMA5" }],
} satisfies Metadata["openGraph"];
