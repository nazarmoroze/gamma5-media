import Image from "next/image";

import { about } from "@/content/home";

import styles from "./About.module.css";

export function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <h2 id="about-title" className={`eyebrow ${styles.label}`}>
          About us
        </h2>
        <div className={styles.copy}>
          <p className={styles.lead}>
            <span className={styles.brand}>GAMMA5</span> {about.lead}
          </p>
          <p className={styles.body}>{about.body}</p>
          <dl className={styles.stats}>
            {about.stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className={`container ${styles.clients}`}>
        <span className={styles.clientsLabel}>Trusted by</span>
        <div className={styles.marquee}>
          <div className={styles.track}>
            <Image src="/media/logos.png" alt={about.clientsAlt} width={1313} height={82} className={styles.logos} />
            <Image src="/media/logos.png" alt="" aria-hidden="true" width={1313} height={82} className={styles.logos} />
          </div>
        </div>
      </div>
    </section>
  );
}
