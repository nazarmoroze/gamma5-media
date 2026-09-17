import { WorkGrid } from "@/components/work/WorkGrid";
import type { HomeData } from "@/sanity/types";

import styles from "./Portfolio.module.css";

type PortfolioProps = { portfolio: NonNullable<HomeData["portfolio"]> };

export function Portfolio({ portfolio }: PortfolioProps) {
  // References to unpublished or deleted cases resolve to null; skip them.
  const cases = portfolio.cases?.filter((item) => item !== null) ?? [];

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
              {portfolio.intro && <p className={styles.intro}>{portfolio.intro}</p>}
            </>
          }
        />
      </div>
    </section>
  );
}
