import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { draftMode } from "next/headers";

import { CookieConsent } from "@/components/site/CookieConsent";
import { DraftModeTools } from "@/components/site/DraftModeTools";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { gaId } from "@/lib/analytics";
import { DEFAULT_SHARE_IMAGE } from "@/lib/metadata";
import { siteUrl } from "@/lib/site";
import { SanityLive, sanityFetch } from "@/sanity/live";
import { HOME_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [{ data: settings }, { data: home }] = await Promise.all([
    sanityFetch({ query: SETTINGS_QUERY, stega: false }),
    sanityFetch({ query: HOME_QUERY, stega: false }),
  ]);
  const name = settings?.name || "GAMMA5";
  const title = home?.seo?.title ? `${home.seo.title} | ${name}` : name;
  const description = home?.seo?.description ?? undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${name}` },
    description,
    applicationName: name,
    // SVG for current browsers, ICO for older ones and Google Search, PNG for iOS home screens.
    // The ICO says 32x32 rather than "any" so Chrome still prefers the SVG.
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    // Fallback for pages without their own metadata; each page sets its full share card via pageMetadata().
    openGraph: {
      type: "website",
      siteName: name,
      locale: "en_US",
      title,
      description,
      images: [DEFAULT_SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: DEFAULT_SHARE_IMAGE.url, alt: DEFAULT_SHARE_IMAGE.alt }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ data: settings }, { isEnabled: isDraftMode }] = await Promise.all([
    sanityFetch({ query: SETTINGS_QUERY }),
    draftMode(),
  ]);

  return (
    <html lang="en" className={instrumentSans.variable} data-scroll-behavior="smooth">
      <body id="top">
        <Header settings={settings} />
        {children}
        <Footer settings={settings} />
        <SanityLive />
        {isDraftMode && <DraftModeTools />}
        <Analytics />
        <SpeedInsights />
        {/* Google Analytics loads only after the visitor accepts. */}
        <CookieConsent gaId={gaId} />
      </body>
    </html>
  );
}
