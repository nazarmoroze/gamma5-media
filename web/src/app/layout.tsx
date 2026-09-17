import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import { Instrument_Sans } from "next/font/google";
import { draftMode } from "next/headers";

import { DisableDraftMode } from "@/components/site/DisableDraftMode";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { siteUrl } from "@/lib/site";
import { urlFor } from "@/sanity/image";
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
  const image = home?.seo?.image?.asset?._id
    ? urlFor(home.seo.image.asset._id).width(1200).height(630).url()
    : undefined;

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
    openGraph: {
      type: "website",
      siteName: name,
      locale: "en_US",
      title,
      description,
      images: image ? [{ url: image, width: 1200, height: 630, alt: home?.seo?.image?.alt ?? name }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
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
        {isDraftMode && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
