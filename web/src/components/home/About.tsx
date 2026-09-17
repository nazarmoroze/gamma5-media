import type { HomeData } from "@/sanity/types";

import styles from "./About.module.css";

type AboutProps = { about: NonNullable<HomeData["about"]>; brandName: string };

export function About({ about, brandName }: AboutProps) {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <span className={`eyebrow ${styles.label}`}>About us</span>
        <div className={styles.copy}>
          <h2 id="about-title" className={styles.heading}>
            <span className={styles.brand}>{brandName}</span> {about.heading}
          </h2>
          {about.lead && <p className={styles.lead}>{about.lead}</p>}
          {about.body && <p className={styles.body}>{about.body}</p>}
          {about.stats?.length ? (
            <dl className={styles.stats}>
              {about.stats.map((stat) => (
                <div key={stat._key} className={styles.stat}>
                  <dt className={styles.statLabel}>{stat.label}</dt>
                  <dd className={styles.statValue}>{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </section>
  );
}
