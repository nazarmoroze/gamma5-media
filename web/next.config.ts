import type { NextConfig } from "next";

// Content Security Policy. Next.js renders inline scripts and styles, so they are allowed inline;
// everything else is limited to this site, Sanity (images, video, live content) and Vercel analytics.
// frame-ancestors lets the Sanity Studio Presentation tool show the site in its preview.
const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  // React needs eval() and a websocket while developing; production never does.
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}https://va.vercel-scripts.com https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.google-analytics.com https://*.googletagmanager.com",
  "media-src 'self' blob: https://cdn.sanity.io",
  "font-src 'self' data:",
  `connect-src 'self' ${isDev ? "ws: " : ""}https://*.sanity.io wss://*.sanity.io https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`,
  "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
  "frame-ancestors 'self' https://studio.gamma5media.com https://*.sanity.studio https://*.sanity.io http://localhost:*",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
