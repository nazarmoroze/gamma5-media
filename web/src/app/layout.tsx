import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GAMMA5 — Creative & Full-Cycle Video Production",
  description:
    "GAMMA5 is a full-cycle video production team based in Cyprus: commercials, real estate videos and creative content from the first idea to final publishing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body id="top">
        <Header />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
