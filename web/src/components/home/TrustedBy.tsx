import Image from "next/image";

import { urlFor } from "@/sanity/image";
import type { HomeData } from "@/sanity/types";

import styles from "./TrustedBy.module.css";

type TrustedByProps = { clients: NonNullable<NonNullable<HomeData["about"]>["clients"]> };

export function TrustedBy({ clients: allClients }: TrustedByProps) {
  const clients = allClients.filter((client) => client.logo?.asset?._id);
  if (clients.length === 0) return null;

  return (
    <section className={styles.trustedBy} aria-labelledby="trusted-by-title">
      <div className={`container ${styles.inner}`}>
        <p id="trusted-by-title" className={styles.label}>
          Trusted by
        </p>
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
                        alt={copy === 0 ? (client.name ?? "") : ""}
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
    </section>
  );
}
