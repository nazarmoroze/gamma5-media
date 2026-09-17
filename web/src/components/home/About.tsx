import Image from "next/image";

import { urlFor } from "@/sanity/image";
import type { HomeData } from "@/sanity/types";

import styles from "./About.module.css";

type AboutProps = { about: NonNullable<HomeData["about"]>; brandName: string };

export function About({ about, brandName }: AboutProps) {
  const clients = about.clients?.filter((client) => client.logo?.asset?._id) ?? [];

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

      {clients.length > 0 && (
        <div className={`container ${styles.clients}`}>
          <span className={styles.clientsLabel}>Trusted by</span>
          <div className={styles.marquee}>
            {/* The list is rendered twice so the loop is seamless; the copy is hidden from assistive tech. */}
            <div className={styles.track}>
              {[0, 1].map((copy) => (
                <ul key={copy} className={styles.logos} aria-hidden={copy === 1 ? true : undefined}>
                  {clients.map((client) => {
                    const dims = client.logo?.asset?.metadata?.dimensions;
                    const ratio = dims?.width && dims?.height ? dims.width / dims.height : 3;
                    return (
                      <li key={`${copy}-${client._key}`} className={styles.logo}>
                        <Image
                          src={urlFor(client.logo!.asset!._id).height(96).url()}
                          alt={copy === 0 ? client.name ?? "" : ""}
                          width={Math.round(48 * ratio)}
                          height={48}
                          unoptimized
                        />
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
