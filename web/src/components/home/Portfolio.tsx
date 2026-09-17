import { WorkGrid } from "@/components/work/WorkGrid";
import type { CaseSummary } from "@/components/work/types";
import { portfolio } from "@/content/home";

import styles from "./Portfolio.module.css";

export function Portfolio({ cases }: { cases: CaseSummary[] }) {
  return (
    <section id="portfolio" className={styles.portfolio} aria-labelledby="portfolio-title">
      <div className="container">
        <WorkGrid
          cases={cases}
          extraTile={{ href: "/work", kicker: "Portfolio", title: "See all our projects.", label: "View all work" }}
          moreLink={{ href: "/work", label: "View all work" }}
          heading={
            <>
              <span className="eyebrow">Portfolio</span>
              <h2 id="portfolio-title" className="section-title">
                {portfolio.title}
              </h2>
              <p className={styles.intro}>{portfolio.intro}</p>
            </>
          }
        />
      </div>
    </section>
  );
}
