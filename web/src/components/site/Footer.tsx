import { Logo } from "@/components/Logo";
import { contacts } from "@/content/home";

import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <Logo className={styles.logo} title="GAMMA5" />
        <p className={styles.copy}>© {new Date().getFullYear()} GAMMA5. Based in Cyprus, working worldwide.</p>
        <nav aria-label="Footer" className={styles.links}>
          <a href={contacts.instagram.href} className={styles.link}>
            Instagram
          </a>
          <a href={contacts.linkedin.href} className={styles.link}>
            LinkedIn
          </a>
          <a href="#top" className={styles.link}>
            Back to top ↑
          </a>
        </nav>
      </div>
    </footer>
  );
}
