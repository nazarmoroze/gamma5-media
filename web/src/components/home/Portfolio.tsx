import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { WorkGrid } from "@/components/work/WorkGrid";
import type { CaseSummary } from "@/components/work/types";

import styles from "./Portfolio.module.css";

export function Portfolio({ cases }: { cases: CaseSummary[] }) {
  return (
    <section id="portfolio" className={styles.portfolio} aria-labelledby="portfolio-title">
      <div className="container">
        <WorkGrid
          cases={cases}
          featureFirst
          heading={
            <>
              <span className="eyebrow">Portfolio</span>
              <h2 id="portfolio-title" className="section-title">
                Selected work
              </h2>
            </>
          }
        />
        <div className={styles.more}>
          <Link href="/work" className="btn btn-outline">
            View all work
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
