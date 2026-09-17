import type { MetadataRoute } from "next";

// Icons for Android home screens and installed shortcuts.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GAMMA5 Media",
    short_name: "GAMMA5",
    description: "Full-cycle video production for brands and businesses in Cyprus.",
    start_url: "/",
    display: "browser",
    background_color: "#070707",
    theme_color: "#070707",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
