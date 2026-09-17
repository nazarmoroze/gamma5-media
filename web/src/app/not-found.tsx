import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";

import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// Shown for unknown URLs and missing cases, inside the site layout so the header and footer stay.
export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <span className="eyebrow">404</span>
        <h1 className={styles.title}>This page doesn’t exist</h1>
        <p className={styles.text}>The link may be outdated or the page has moved. Here is where you can go instead.</p>
        <div className={styles.actions}>
          <Link href="/" className="btn btn-red">
            Go to the homepage
          </Link>
          <Link href="/work" className="btn btn-outline">
            See our work
            <ArrowRightIcon />
          </Link>
        </div>
        <Link href="/#contact" className={styles.contact}>
          Or tell us about your project
        </Link>
      </div>
    </main>
  );
}
