import Link from "next/link";

import { Logo } from "@/components/Logo";
import { CookieSettingsButton } from "@/components/site/CookieSettingsButton";
import { contactLinks, newTab } from "@/lib/site";
import type { Settings } from "@/sanity/types";

import styles from "./Footer.module.css";

export function Footer({ settings }: { settings: Settings | null }) {
  const socials = contactLinks(settings).filter((link) => link.key === "instagram" || link.key === "linkedin");
  const name = settings?.name ?? "GAMMA5";

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <Logo className={styles.logo} title={name} />
        <p className={styles.copy}>
          © {new Date().getFullYear()} {settings?.registeredName || name}. {settings?.location}
        </p>
        <nav aria-label="Footer" className={styles.links}>
          {socials.map((link) => (
            <a key={link.key} href={link.href} className={styles.link} {...newTab}>
              {link.label}
            </a>
          ))}
          <Link href="/privacy-policy" className={styles.link}>
            Privacy Policy
          </Link>
          <CookieSettingsButton className={styles.link} />
          <a href="#top" className={`${styles.link} ${styles.toTop}`}>
            Back to top ↑
          </a>
        </nav>
      </div>
    </footer>
  );
}
