import { stegaClean } from "next-sanity";

import type { HomeData } from "@/sanity/types";

import styles from "./About.module.css";

type AboutProps = { about: NonNullable<HomeData["about"]>; brandName: string };

// The heading is shown exactly as written in Sanity; the brand name is picked out in red wherever it appears.
function highlightBrand(text: string, brandName: string) {
  const brand = stegaClean(brandName);
  if (!brand || !text.includes(brand)) return text;
  return text.split(brand).flatMap((part, index) =>
    index === 0
      ? [part]
      : [
          <span key={index} className={styles.brand}>
            {brand}
          </span>,
          part,
        ],
  );
}

export function About({ about, brandName }: AboutProps) {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <span className={`eyebrow ${styles.label}`}>About us</span>
        <div className={styles.copy}>
          <h2 id="about-title" className={styles.heading}>
            {highlightBrand(about.heading ?? "", brandName)}
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
